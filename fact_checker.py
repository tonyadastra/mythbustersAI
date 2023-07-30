from langchain.utilities import GoogleSearchAPIWrapper
from langchain.document_loaders import AsyncHtmlLoader
from langchain.document_transformers import Html2TextTransformer
from langchain.document_loaders import WikipediaLoader

from anthropic import Anthropic, HUMAN_PROMPT, AI_PROMPT
import ast
import os
from dotenv import load_dotenv


from concurrent.futures import ThreadPoolExecutor
from functools import partial

import time

load_dotenv()

def anthropicGetList(prompt):
  completion = anthropic.completions.create(
      model="claude-instant-1.1",
      max_tokens_to_sample=300,
      prompt=f"{HUMAN_PROMPT}{prompt}{AI_PROMPT}[")
  
  result_list = ast.literal_eval("["+completion.completion)
  return result_list

def anthropicFactCheck(claim, knowledge_base):

    fact_check_prompt = """
<context>"""+ str(knowledge_base)+"""</context>
<meta_info>this is a claim made by """+ claim["speaker"] +""" in a debate against """+ claim["opponent"] +""":</meta_info>
<claim>"""+ claim["claim"] +f"""</claim>
<instruction>
Fact-check the claim of """+ claim["speaker"] +""" given the provided context.
Carefully read the context and the claim to determine whether the claim is true or false. Focus on all details like the specific wording, people and dates in the provided context. Also make sure that you understand who said what in the context, as the claim might be attributed to someone else than the speaker meant.
If you can reliably say that the claim is true given the provided context, give a score of 1.
If you can reliably say that the claim is false given the provided context, give a score of -1.
If some parts of the claim are true and some parts are false, give a score between -1 and 1.
If you cannot reliably say whether the claim is true or false given the provided context, give a neutral score and set the unsure_flag to True.
</instruction>

<response_information>
score: a float number from -1 to 1, where -1 is false and 1 is true. decimal numbers in between are also possible to indicate truthfulness.
reason: a string that explains why the claim is true or false and your reasoning about the score.
unsure_flag: a boolean (True/False) stating that the model is unsure whether the claim is true or false.
</response_information>

<example_response>
<score>1</score>
<reason>The claim is true, as according to cnn.com and nytimes.com, the claim was stated by the opponent in 2004.</reason>
<unsure_flag>False</unsure_flag>
</example_response>
"""

    completion = anthropic.completions.create(
        model="claude-instant-1.1",
        max_tokens_to_sample=1000,
        prompt=f"{HUMAN_PROMPT}{fact_check_prompt}{AI_PROMPT}<score>")

    return "<score>"+completion.completion

# def getWikiContent(queries, max_sources = 1):
#     all_sources = []
#     for query in queries:
#         wiki_docs = WikipediaLoader(query=query, doc_content_chars_max=20000000000, load_max_docs=max_sources).load()

#         sources = []
#         for doc in wiki_docs:
#             source = dict()
#             source["url"] = doc.metadata["source"]
#             source["content"] = doc.page_content
#             sources.append(source)

#         all_sources += sources

#     return all_sources

def getWikiContent(queries, max_sources=1):
    def fetch_sources(query, max_sources):
        wiki_docs = WikipediaLoader(query=query, doc_content_chars_max=2000000, load_max_docs=max_sources).load()

        sources = []
        for doc in wiki_docs:
            source = {"url": doc.metadata["source"], "content": doc.page_content}
            sources.append(source)

        return sources

    # Adjust the number of threads based on your system capabilities
    num_threads = min(len(queries), 5)  # You can experiment with this value
    with ThreadPoolExecutor(max_workers=num_threads) as executor:
        sources_lists = executor.map(partial(fetch_sources, max_sources=max_sources), queries)

    # Flatten the list of lists
    all_sources = [source for sources_list in sources_lists for source in sources_list]

    # Remove duplicates by url
    filtered_sources = []
    urls = set()

    for source in all_sources:
        if source["url"] not in urls:
            filtered_sources.append(source)
            urls.add(source["url"])

    return filtered_sources


def googleSearch(claims, search_results_per_claim = 1):

    # Pre-constrained programmable search engine
    search = GoogleSearchAPIWrapper(google_api_key=os.environ.get("GOOGLE_API_KEY"), google_cse_id=os.environ.get("GOOGLE_CSE_ID"))

    results = []
    for q in claims:
        results.extend([res['link'] for res in search.results(q, search_results_per_claim)])
    links = set(results)
    loader = AsyncHtmlLoader(web_path=list(links))
    loader.requests_per_second = 10
    html2text = Html2TextTransformer()
    search_results = loader.load()
    search_results = list(html2text.transform_documents(search_results))

    sources = []

    for doc in search_results:
        source = dict()
        source["url"] = doc.metadata["source"]
        source["content"] = doc.page_content
        sources.append(source)

    return sources

anthropic = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

# Define claims
claim = dict()
claim["claim"]="You did a crime bill, 1994, when you call them super predators, African Americans, super predators, and they’ve never forgotten it. They’ve never forgotten it, Joe."
claim["speaker"] = "Donald Trump"
claim["opponent"] = "Joe Biden"

wikipedia_prompt = """
this is a claim made by """+ claim["speaker"] +""" in a debate against """+ claim["opponent"] +""":
<claim>"""+ claim["claim"] +"""</claim>
<instruction>provide me with a python list of wikipedia queries that you need to fact-check this.</instruction>
<example_response>["Flora of France","Geography of Italy","Climate of France"]</example_response>
"""

google_search_prompt = """
this is a claim made by """+ claim["speaker"] +""" in a debate against """+ claim["opponent"] +""":
<claim>"""+ claim["claim"] +"""</claim>
<instruction>provide me with a python list of google search queries that you need to fact-check this.</instruction>
<example_response>["Flora of France","Geography of Italy","Climate of France"]</example_response>
"""

start_time = time.time()
print("Starting..")

# Get list of queries
time2 = time.time()
wikipedia_queries = anthropicGetList(wikipedia_prompt)
print("Time wiki queries: ", time.time() - time2)
time2 = time.time()
google_search_queries = anthropicGetList(google_search_prompt)
print("Time google queries: ", time.time() - time2)
time2 = time.time()

# Search the web
wiki_results = getWikiContent(wikipedia_queries)
print("get wiki content: ", time.time() - time2)
time2 = time.time()
google_results = googleSearch(google_search_queries)
print("get google content: ", time.time() - time2)
time2 = time.time()

all_results = google_results + wiki_results

print("Time taken to gather references: ", time.time() - start_time)

print(len(all_results))

for result in all_results:
    print(result["url"])
    print("----------------------------------------------------")

print("Fact-checking...")
time2 = time.time()
result = anthropicFactCheck(claim, all_results)
print("fact-check: ", time.time() - time2)

print(result)
print("Time taken to gather references + let claude fact-check it: ", time.time() - start_time)