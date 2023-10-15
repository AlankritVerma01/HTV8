# Paper:Vision | Transform articles into interactive mind maps, aiding comprehension and engagement! Ideal for readers with ADHD.
[Hack The Valley 8 - Fall 2023 - Devpost]()

![PaperVision](https://github.com/AlankritVerma01/HTV8/assets/90617686/a8e700d2-f4e1-4cbb-9b19-985c56aca8c0)

## About
Paper:Vision is a **web-based framework designed for individuals with ADHD** that takes articles, breaks them down into sections and subsections, and generates **visual mind maps**. Each node in the mind map contains a **summary** of its corresponding section with **bullet points**. The tool also includes a **chatbot** that can answer questions related to the content, making it easier for users to **actively interact with articles**, save time, and improve comprehension.

## How It Works
The back-end uses **Python** and **GPT-3.5** to parse out articles into relative sections and subsection. Each of them are represented as nodes, having attributes such as Title, Text, Children etc. The back-end uses **Flask** to communicate with **MongoDB** and send the nodes to Front-end where the mind map is generated using **React** and **WebGL**.
