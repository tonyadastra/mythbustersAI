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
from fact_checker import FactChecker
import base64
from fastapi.middleware.cors import CORSMiddleware

from typing import Optional

load_dotenv()

def init_client():
    client = anthropic.Client(api_key=os.getenv("ANTHROPIC_API_KEY"))
    return client

app = FastAPI()
app.add_middleware(
    CORSMiddleware, allow_origins=['*'], allow_methods=['*'],
    allow_headers=['*'],
)

class QuestionReq(BaseModel):
    question: Optional[str] = ""

class ClaimInput(BaseModel):
    claim: str
    speaker: str
    opponent: str

@app.post("/generate")
async def generate(req: QuestionReq):
    client = init_client()
    response = generate_moderator_questions(client, req.question) 
    return response

@app.post("/fact_check")
def generate(input: ClaimInput):
    claim = dict()
    claim["claim"]=input.claim
    claim["speaker"] = input.speaker
    claim["opponent"] = input.opponent

    truthGPT = FactChecker()
    fact_checking_result = truthGPT.factCheck(claim)
    print(fact_checking_result)
    return fact_checking_result
    
def generate_moderator_questions(client, question):

    if question == "":
        print("Script called with args")
        print(sys.argv)
        random_question = question
    else:
        print("Script called without args")
        with open(r"./prompts/questions.txt") as f:
            questions = f.read().split('\n')
            questions = list(filter(None, questions)) 
            random_question = random.choice(questions)
            print(random_question)

    with open(r"./prompts/flow.md") as f:
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
    stream: bool

@app.post("/text-to-speech")
async def generate(req: TextToSpeechReq):
    apikey = os.getenv("xi-api-key")

    response = generate_audio_stream(apikey, req.role, req.transcript, req.stream)
    return response

def generate_audio_stream(apikey, role, transcript, stream):

    if role == "elon":
        video_id = "Eb1wB6y1PjLQCBQagBaG"
    elif role == "biden":
        video_id = "M3hnAaTIrQDWc81HGOZO"
    elif role == "trump":
        video_id = "eP9mKBC6jXybCf35PIwO"
    else :
        video_id = "Eb1wB6y1PjLQCBQagBaG"

    CHUNK_SIZE = 1024

    if stream:
        url = "https://api.elevenlabs.io/v1/text-to-speech/{video_id}/stream"
    else:
        url = "https://api.elevenlabs.io/v1/text-to-speech/{video_id}"
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

    audio_stream = io.BytesIO()

    for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
        if chunk:
            audio_stream.write(chunk)

    audio_stream.seek(0)

    if stream:
        return audio_stream
    else:
        audio_data_bytes = audio_stream.read()
        audio_stream.close()
        audio_data_base64 = base64.b64encode(audio_data_bytes).decode('utf-8')
        audio_data_json = {
            'audio_bytes': audio_data_base64
        }
        return json.dumps(audio_data_json)