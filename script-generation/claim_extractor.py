from langchain.utilities import GoogleSearchAPIWrapper
from langchain.document_loaders import AsyncHtmlLoader
from langchain.document_transformers import Html2TextTransformer
from langchain.document_loaders import WikipediaLoader
from anthropic import Anthropic, HUMAN_PROMPT, AI_PROMPT
import xml.etree.ElementTree as ET
import ast
import os
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor
from functools import partial
import time
import re
import json
from fact_checker import FactChecker

load_dotenv()

class ClaimExtractor:

    def __init__(self):
        self.anthropic = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

    def extractClaims(self, paragraph):
        claim_extraction_prompt = """
this is a paragraph out of a debate between """+ paragraph["speaker"] +""" and """+ paragraph["opponent"] +""", moderated by """+ paragraph["moderator"] +""". """+ paragraph["speaker"] +""" says:
<paragraph>"""+ paragraph["paragraph"] +"""</paragraph>
<instruction>
Extract all claims from the paragraph that are made by """+ paragraph["speaker"] +""" and need to be fact-checked.
Focus on claims that are targeting past events, as we cannot fact-check something that will happen in the future.
Provide me with a python list of the claims (as quotes from the paragraph) that you have extracted.
</instruction>
<example_response>['There are no longer any old growth forests left in France.', 'The climate of southern France can no longer support olive trees due to climate change.', 'Invasive insect species have destroyed 30% of grapevines in France.']</example_response>"""

        claims = self.anthropicGetList(claim_extraction_prompt)
        
        claims_output = []
        for claim in claims:
            claims_output.append({"claim": claim, "speaker": paragraph["speaker"], "opponent": paragraph["opponent"]})

        return claims_output
    
    def anthropicGetList(self, prompt):
        completion = self.anthropic.completions.create(
            model="claude-instant-1.1",
            max_tokens_to_sample=10000,
            prompt=f"{HUMAN_PROMPT}{prompt}{AI_PROMPT}[")
        # print(completion.completion)
        result_list = ast.literal_eval("["+completion.completion)
        return result_list


speaker = "Donald Trump"
opponent = "Joe Biden"
moderator = "Elon Musk"
paragraph = "Thank you Elon. Look, let me be clear, Putin’s invasion of Ukraine is an unprovoked act of aggression that threatens democracy in Europe and beyond. My administration has led the effort to support the brave Ukrainian people with military aid, humanitarian relief and crippling sanctions on Russia. But there are still tough days ahead. We’ll continue rallying our NATO allies to stand united against Russian aggression. And I was always supplying Ukraine’s fighters with the weapons they needed to defend their homeland, even as Putin continued his brutal assaults on civilians. We’ll welcome Ukrainian refugees with open arms. Most importantly, we’ll keep standing on the side of freedom and sovereignty. Putin wants to destroy the international order. On my watch, that simply won’t happen. The free world will meet this test - democracy will prevail over tyranny."

claim_extractor = ClaimExtractor()
paragraph_dict = dict()
paragraph_dict["speaker"] = speaker
paragraph_dict["opponent"] = opponent
paragraph_dict["moderator"] = moderator
paragraph_dict["paragraph"] = paragraph

claims = claim_extractor.extractClaims(paragraph_dict)
print(claims)

truthGPT = FactChecker()

for claim in claims:
    fact_checking_result = truthGPT.factCheck(claim)
    print(fact_checking_result)

