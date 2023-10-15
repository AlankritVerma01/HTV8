import aiohttp
import asyncio
import openai

openai.api_key = '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'


async def summarize(session, section, max_tokens=280, temp=0):
    system = f'Act as a professional scientist that reviews articles.'
    article = f'article: {section}'
    prompt = f'{system} {article}.\nExplain all important information, terms, and ideas in summarized bullet points: '

    history = [{"role": "system", "content": system},
               {"role": "user", "content": prompt}]

    url = 'https://api.openai.com/v1/chat/completions'
    headers = {
        'Authorization': f'Bearer {openai.api_key}',
        'Content-Type': 'application/json'
    }
    payload = {
        'model': 'gpt-3.5-turbo',
        'messages': history,
        'temperature': temp,
        'max_tokens': max_tokens,
        'top_p': 1,
        'frequency_penalty': 0,
        'presence_penalty': 0
    }

    async with session.post(url, json=payload, headers=headers) as response:
        response_json = await response.json()
        if response.status == 200:
            return response_json['choices'][0]['message']['content']
        else:
            print(f'Error: {response_json}')
            return None


async def main():
    sections = ['Hello this is biology', 'Hello this is chemistry',
                'hello this is computer science and i would like to talk about ai']   # List of sections to be summarized
    async with aiohttp.ClientSession() as session:
        summaries = await asyncio.gather(*(summarize(session, section) for section in sections))
        for i, summary in enumerate(summaries):
            print(f'Summary {i + 1}:\n{summary}\n')

# Run the main function
if __name__ == '__main__':
    asyncio.run(main())
