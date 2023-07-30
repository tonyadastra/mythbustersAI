from dotenv import load_dotenv
import anthropic
import os
import xml.etree.ElementTree as ET


load_dotenv()


def init_client():
    client = anthropic.Client(api_key=os.getenv("ANTHROPIC_API_KEY"))
    return client
    

def generate_moderator_questions(client):
    with open('./script-generation/prompts/moderator.md') as f:
        prompt = f.read()
    
    resp = client.completions.create(
        model="claude-2",
        prompt=f"""\n\nHuman: {prompt}
        \n\nAssistant: Here is the response in XML format:\n\n""",
        max_tokens_to_sample=1000,
        stream=False,
        )
    xml_string = resp.completion
    print(xml_string)
    xml_string = "<root>" + xml_string + "</root>"
    root = ET.fromstring(xml_string)

    questions = {}
    for child in root:
        questions[child.attrib['name']] = [el.text for el in child if el.tag == "question"]
    print(questions)
    return questions


def generate_moderator_questions(client):
    with open('./script-generation/prompts/moderator.md') as f:
        prompt = f.read()
    
    resp = client.completions.create(
        model="claude-2",
        prompt=f"""\n\nHuman: {prompt}
        \n\nAssistant: Here is the response in XML format:\n\n""",
        max_tokens_to_sample=1000,
        stream=False,
        )
    xml_string = resp.completion
    print(xml_string)
    xml_string = "<root>" + xml_string + "</root>"
    root = ET.fromstring(xml_string)

    questions = {}
    for child in root:
        questions[child.attrib['name']] = [el.text for el in child if el.tag == "question"]
    print(questions)
    return questions


def respond_as_trump(client):
    pass


def respond_as_biden(client):
    pass
    

if __name__ == "__main__":
    client = init_client()
    generate_moderator_questions(client)