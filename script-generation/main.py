from dotenv import load_dotenv
import anthropic
import os
import xml.etree.ElementTree as ET
import json
import random
import sys
from fastapi import FastAPI
from pydantic import BaseModel
import requests
import io

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


class TextToSpeechReq(BaseModel):
    role: str
    transcript: str

@app.post("/text-to-speech")
async def generate(req: TextToSpeechReq):
    apikey = os.getenv("xi-api-key")

    response = generate_audio_stream(apikey, req.role, req.transcript) 
    return response

def generate_audio_stream(apikey, role, transcript):

    if role == "elon":
        video_id = "Eb1wB6y1PjLQCBQagBaG"
    elif role == "biden":
        video_id = "M3hnAaTIrQDWc81HGOZO"
    elif role == "trump":
        video_id = "eP9mKBC6jXybCf35PIwO"
    else :
        video_id = "Eb1wB6y1PjLQCBQagBaG"

    CHUNK_SIZE = 1024
    url = "https://api.elevenlabs.io/v1/text-to-speech/{video_id}/stream"
    url = url.format(video_id=video_id)

    print(url)

    headers = {
    "Accept": "audio/mpeg",
    "Content-Type": "application/json",
    "xi-api-key": apikey
    }

    data = {
    "text": transcript,
    "model_id": "eleven_monolingual_v1",
    "voice_settings": {
        "stability": 0.5,
        "similarity_boost": 0.5
    }
    }

    response = requests.post(url, json=data, headers=headers, stream=True)

     # Create a BytesIO object to store the response content in memory
    audio_stream = io.BytesIO()

    for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
        if chunk:
            # Write the chunk to the BytesIO stream
            audio_stream.write(chunk)

    # Rewind the stream to the start
    audio_stream.seek(0)

    # Return the in-memory stream
    return audio_stream