import os, openai, PyPDF2, asyncio, aiohttp
from dotenv import load_dotenv; load_dotenv()
import summarizer

openai.api_key = os.environ.get("OPENAI_API_KEY")
COLORS = ['#0d6c6c', '#139f9f', '#16c9c9', '#30e9e9', '#73f0f0']
SIZES = [60, 50, 40, 25, 10]


class SectionNode:

    def __init__(self, title, page, top):
        self.id = str(id(self))
        self.title = title
        self.text = ""
        self.children = []
        self.page = page
        self.top = top
        self.depth = None
        self.color = None
        self.size = None

    def addChild(self, other):
        self.children.append(other)

    def __str__(self):
        return f'Depth: {self.depth}\n' \
               f'Title: {self.title}\n' \
               f'Page: {self.page}\n' \
               f'Text: {self.text}\n' \
               f'Children: {[child.title for child in self.children]}\n'


def create_graph(pdf_reader, title, page):
    root = SectionNode(title, page, None)
    get_bookmark(root, pdf_reader.outline)
    return root


def get_bookmark(root, outline):
    new = None

    for item in outline:
        if isinstance(item, list):
            get_bookmark(new, item)
        else:
            new = SectionNode(item.title, item.page, item.top)
            root.addChild(new)


def get_json_output(json_output, root):
    json_output[root.id] = {}
    json_output[root.id]["depth"] = root.depth
    json_output[root.id]["size"] = root.size
    json_output[root.id]["color"] = root.color
    json_output[root.id]["page"] = root.page
    json_output[root.id]["top"] = root.top
    json_output[root.id]["title"] = root.title
    json_output[root.id]["text"] = root.text
    json_output[root.id]["children"] = [child.id for child in root.children]

    for child in root.children:
        get_json_output(json_output, child)


def get_text_from_page(page, bottom, up):
    def visitor_body_with_range(bottom, up):
        def visitor_body(text, cm, tm, fontDict, fontSize):
            y = tm[5]
            if bottom < y < up:
                parts.append(text)

        return visitor_body

    parts = []
    page.extract_text(visitor_text=visitor_body_with_range(bottom=bottom, up=up))
    return "".join(parts).strip()


def get_all_nodes(all_nodes, root):
    all_nodes.append(root)
    for child in root.children:
        get_all_nodes(all_nodes, child)


def get_page_number(pdf_reader, node):
    if type(node.page) == PyPDF2.PageObject:
        return pdf_reader.get_page_number(node.page)
    return pdf_reader.get_page_number(pdf_reader.get_object(node.page))


def adjust_page_numbers(pdf_reader, all_nodes):
    for node in all_nodes:
        node.page = get_page_number(pdf_reader, node)


def float2string(all_nodes):
    for node in all_nodes:
        node.page = str(node.page)
        node.top = str(node.top)
        node.depth = str(node.depth)


def get_text_all_nodes(pdf_reader, all_nodes):
    prev_i = 1
    next_i = 2

    while next_i < len(all_nodes):

        prev_node = all_nodes[prev_i]
        next_node = all_nodes[next_i]
        page = pdf_reader.pages[prev_node.page]

        if prev_node.page == next_node.page:
            text = get_text_from_page(page, bottom=next_node.top, up=prev_node.top).strip()
            prev_node.text = text[text.find('\n') + 1:].replace('\n', ' ')

        else:
            text = get_text_from_page(page, bottom=42, up=prev_node.top).strip()
            text = text[text.find('\n') + 1:].replace('\n', ' ')

            curr_page_num = prev_node.page + 1

            while curr_page_num < next_node.page:
                text += pdf_reader.pages[curr_page_num].extract_text().replace('\n', ' ')
                curr_page_num += 1

            text += get_text_from_page(pdf_reader.pages[curr_page_num], bottom=next_node.top, up=750).replace('\n', ' ')
            prev_node.text = text

        next_i, prev_i = next_i + 1, prev_i + 1

    # For the last node
    prev_node = all_nodes[prev_i]
    page = pdf_reader.pages[prev_node.page]
    text = get_text_from_page(page, bottom=50, up=prev_node.top).strip()
    text = text[text.find('\n') + 1:].replace('\n', ' ')

    curr_page_num = prev_node.page + 1
    while curr_page_num < len(pdf_reader.pages):
        text += pdf_reader.pages[curr_page_num].extract_text().replace('\n', ' ')
        curr_page_num += 1

    prev_node.text = text[:text.find("References")]


def get_title_root(pdf_reader):
    prompt = f"What is the title of this article?\n{pdf_reader.pages[0].extract_text()}\nTitle: "
    response, _ = ask_chatgpt(prompt, history=[], system=None, new_chat=True, max_tokens=50, temp=0)
    return response.strip()


def get_text_root(pdf_reader):
    prompt = f"What is the abstract of this article?\n{pdf_reader.pages[0].extract_text()}\nAbstract: "
    response, _ = ask_chatgpt(prompt, history=[], system=None, new_chat=True, max_tokens=250, temp=0)
    return response.strip()


def get_depth(root, depth):
    root.depth = depth
    for child in root.children:
        get_depth(child, depth + 1)


def get_all_colors(all_nodes):
    for node in all_nodes:
        node.color = COLORS[node.depth]


def get_all_size(all_nodes):
    for node in all_nodes:
        node.size = SIZES[node.depth]


def user_said(content, history):
    history.append({"role": "user", "content": content})


def assistant_said(content, history):
    history.append({"role": "assistant", "content": content})


def ask_chatgpt(user, history, system=None, new_chat=False, max_tokens=256, only_response=False, temp=0,
                model='gpt-3.5-turbo'):
    history = [] if new_chat else history

    if system and new_chat:
        history.append({"role": "system", "content": system})
    user_said(user, history)

    response = openai.ChatCompletion.create(
        model=model,
        messages=history,
        temperature=temp,
        max_tokens=max_tokens,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    response = response['choices'][0]['message']['content']

    if only_response:
        return response
    else:
        assistant_said(response, history)
        return response, history


def answer_question(section, question, max_tokens=150, temp=0):

    system = f'Act as a professional scientist that reviews articles.'
    prompt = f'article: {section}.\nQuestion: {question}\nAnswer: '

    history = [{"role": "system", "content": system}, {"role": "user", "content": prompt}]

    response = openai.ChatCompletion.create(
      model='gpt-3.5-turbo',
      messages=history,
      temperature=temp,
      max_tokens=max_tokens,
      top_p=1,
      frequency_penalty=0,
      presence_penalty=0
    )
    return response['choices'][0]['message']['content']


def main(opened_pdf):
    pdf_reader = PyPDF2.PdfReader(opened_pdf)
    root = create_graph(pdf_reader, title=get_title_root(pdf_reader), page=pdf_reader.pages[0])
    root.text = get_text_root(pdf_reader)

    all_nodes = []
    json_output = {}

    get_all_nodes(all_nodes, root)
    get_depth(root, 0)
    adjust_page_numbers(pdf_reader, all_nodes)
    get_text_all_nodes(pdf_reader, all_nodes)
    get_all_colors(all_nodes)
    get_all_size(all_nodes)
    # float2string(all_nodes)

    section_texts = [node.text for node in all_nodes]
    summarized_texts = asyncio.run(summarizer.main(section_texts[1:]))

    for i, each_summary in enumerate(summarized_texts):
        all_nodes[i+1].text = each_summary

    get_json_output(json_output, root)
    return json_output


if __name__ == '__main__':
    json_output = main(open('attention.pdf', 'rb'))
    print(json_output)
