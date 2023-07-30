from dotenv import load_dotenv
import anthropic
import os
import xml.etree.ElementTree as ET
import json
import random
import sys
from fastapi import FastAPI
from pydantic import BaseModel

load_dotenv()

def init_client():
    client = anthropic.Client(api_key=os.getenv("ANTHROPIC_API_KEY"))
    return client

app = FastAPI()

class QuestionReq(BaseModel):
    question: str

@app.post("/generate")
async def generate(req: QuestionReq):
    client = init_client()
    response = generate_moderator_questions(client, req.question) 
    return response
    
def generate_moderator_questions(client, question):

    if question == "":
        print("Script called with args")
        print(sys.argv)
        random_question = question
    else:
        print("Script called without args")
        with open(r"C:\Users\anand\Desktop\vscode_projects\catchTheLiar-AI\script-generation/prompts/questions.txt") as f:
            questions = f.read().split('\n')
            questions = list(filter(None, questions)) 
            random_question = random.choice(questions)
            print(random_question)

    with open(r"C:\Users\anand\Desktop\vscode_projects\catchTheLiar-AI\script-generation/prompts/flow.md") as f:
        prompt = f.read()
        updated_prompt = prompt.replace("$question", random_question)
    
    resp = client.completions.create(
        model="claude-instant-1",
        prompt=f"""\n\nHuman: {updated_prompt}
        \n\nAssistant: Here is the response in XML format:\n\n""",
        max_tokens_to_sample=1000,
        stream=False,
        )
    xml_string = resp.completion
    print(xml_string)

    root = ET.fromstring(xml_string)

    json_data = {}

    json_data['elon_musk_question'] = root.find('question').text   
    json_data['joe_biden_answer'] = root.find('answer1').text
    json_data['donald_trump_answer'] = root.find('answer2').text
    json_data['joe_biden_rebuttal'] = root.find('rebuttal1').text
    json_data['donald_trump_rebuttal'] = root.find('rebuttal2').text

    return json_data