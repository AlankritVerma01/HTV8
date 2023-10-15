import os, requests, json, openai, PyPDF2, pdfplumber, re, tiktoken
from dotenv import load_dotenv;

load_dotenv()
from io import BytesIO
from pdfminer.high_level import extract_text

openai.api_key = os.environ.get("OPENAI_API_KEY")


class SectionNode:

    def __init__(self, title, start):
        self.id = str(id(self))
        self.start = start
        self.title = title
        self.text = ""
        self.children = []
        self.json = {}

        self.getText()
        self.getSummary()

    def addChild(self, other):
        self.children.append(other)

    def getJson(self):
        self.json[self.id] = {}
        self.json[self.id]["start"] = self.start
        self.json[self.id]["title"] = self.title
        self.json[self.id]["text"] = self.text
        self.json[self.id]["children"] = [child.id for child in self.children]
        return self.json

    def getText(self):
        # TODO Use PyPDF to get the text based on self.start
        self.text = self.title

    def getSummary(self):
        # TODO Use GPT to get the summary of text
        self.text = self.title

    def __str__(self):
        return f'Title: {self.title}\n' \
               f'Text: {self.text}\n' \
               f'Children: {[child.title for child in self.children]}\n'


def create_graph(pdf_path):
    pdf_file = open(pdf_path, 'rb')
    pdf_reader = PyPDF2.PdfReader(pdf_file)

    # TODO Use GPT to get the root note information right
    root = SectionNode("Attention Is All You Need", "START")
    get_bookmark(root, pdf_reader.outline)

    return root


def get_bookmark(root, outline):
    new = None

    for item in outline:

        if isinstance(item, list):
            get_bookmark(new, item)
        else:
            new = SectionNode(item.title, item.page)
            root.addChild(new)


def get_json_output(json_output, root):
    json_output.append(root.getJson())
    for child in root.children:
        get_json_output(json_output, child)


def main(pdf_path):
    json_output = []
    root = create_graph(pdf_path)
    get_json_output(json_output, root)
    return json_output
