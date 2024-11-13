from re import sub
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from call2 import model1, collection1, tokenizer1,transform_img,collection2,model2,tokenizer2,preprocess #collection2 for blip
from typing import List, Optional
import json
import sys
from bisect import bisect_right
from fastapi.templating import Jinja2Templates
import torch
from collections import defaultdict
from rapidfuzz import fuzz,process
from elasticsearch import Elasticsearch
from create_submit_file import add_submission_to_csv
from pathlib import Path
import random
import google.generativeai as genai
import os
from openai import OpenAI

sys.path.insert(0, "/mlcv2/WorkingSpace/Personal/longlb/AIC_2024/demo_system/unilm/beit3")

es = Elasticsearch("http://192.168.80.2:9200")

class Query(BaseModel):
    textual: Optional[str] = None
    objects: Optional[str] = ""
    colors: Optional[str] = ""
    ocr: Optional[str] = ""
    imgPath: Optional[str] = None
    asr: Optional[str] = None
    metadata: Optional[str] = None
    collection: Optional[str] = None
    
class Item(BaseModel):
    query: Optional[List[Query]] = None

class Result(BaseModel):
    path: Optional[List] = None
    path2: Optional[List] = None
    frame_idx: Optional[List] = None
    frame_idx2: Optional[List] = None
    vid_name: Optional[List] = None

class ImageQuery(BaseModel):
    directory: str

class Image(BaseModel): 
    query: List[ImageQuery]

class Submission(BaseModel):
    file_name: str
    vid_name: str
    frame_idx: int
    answer: Optional[str] = None

class SubmitResponse(Submission):
    result: str

class Reprompt(BaseModel):
    repromptedText1: str
    repromptedText2: Optional[str] = None

class PromptText(BaseModel):
    prompt1: str
    prompt2: Optional[str] = None
    
origins = [
    "http://localhost:1999",
    "http://0.0.0.0:1999",
    "http://localhost:3031",
    "http://0.0.0.0:3031",
]

CHUNK_SIZE = 1024*1024

# client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
client = OpenAI()
app = FastAPI()
print(os.environ["OPENAI_API_KEY"])
templates = Jinja2Templates(directory="/mlcv2/WorkingSpace/Personal/longlb/AIC_2024/Image_Retrieval/frontend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    # allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

output = []

@app.post("/submit", response_model=SubmitResponse)
async def submit_answer(submission: Submission):
    add_submission_to_csv(submission.file_name, submission.vid_name, submission.frame_idx, submission.answer)
    print("Lmao submit")
    return {
        "file_name": submission.file_name,
        "vid_name": submission.vid_name,
        "frame_idx": submission.frame_idx,
        "answer": submission.answer,
        "result": "Success"
    }

def image_embedded(image_query):
    from similar_search import main
    return main(image_query,torch,preprocess,model2,collection2)

def result(query0, object0, color0, ocr0, query1='', object1 ='', color1 = '', ocr1='', selectedCollection = ''):
    try:
        from search import main as search_main_beit
        from search_clip import main as search_main_clip
        from temporal_query import main as temporal_main_beit
        from temporal_query_clip import main as temporal_main_clip
        
        query0_str = json.dumps(query0)
        
        print(selectedCollection)
        
        if not query1: # Single query search
            print("single search")
            
            if selectedCollection == 'beit':
                return search_main_beit(query0_str, model1, collection1, transform_img, tokenizer1, torch, defaultdict,fuzz,process,object0, color0,ocr0)
            elif selectedCollection == 'clip':
                return search_main_clip(query0_str, model2, collection2, preprocess, tokenizer2, torch, defaultdict,fuzz,process,object0, color0,ocr0)
            else:
                print("merge search")
                path_clip, frameidx_clip = search_main_clip(query0_str, model2, collection2, preprocess, tokenizer2, torch, defaultdict,fuzz,process,object0, color0,ocr0)
                path_beit, frameidx_beit = search_main_beit(query0_str, model1, collection1, transform_img, tokenizer1, torch, defaultdict,fuzz,process,object0, color0,ocr0)

                output_path = []
                output_frameidx = []
                map_path = {}

                for idx1, path1 in enumerate(path_beit):
                    if path1 not in map_path:
                        map_path[path1] = idx1

                for idx2, path2 in enumerate(path_clip):
                    if path2 in map_path:
                        output_path.append(path2)
                        output_frameidx.append(frameidx_clip[idx2])
                

                return output_path, output_frameidx
            
            
        else: # Temporal query search
            print("temporal search")
            
            query1_str = json.dumps(query1)
            if selectedCollection == 'beit':
                return temporal_main_beit(query0_str, query1_str, model1, collection1,  tokenizer1, torch, defaultdict, object0, object1, color0, color1)
            elif selectedCollection == 'clip':
                return temporal_main_clip(query0_str, query1_str, model2, collection2, tokenizer2, torch, defaultdict, object0, object1, color0, color1)
            else:
                path1_clip, path2_clip, frameidx1_clip, frameidx2_clip = temporal_main_clip(query0_str, query1_str, model2, collection2, tokenizer2, torch, defaultdict, object0, object1, color0, color1)
                path1_beit, path2_beit, frameidx1_beit, frameidx2_beit = temporal_main_beit(query0_str, query1_str, model1, collection1, tokenizer1, torch, defaultdict, object0, object1, color0, color1)

                beit_pairs = set(zip(path1_beit, path2_beit))

                output_path1 = []
                output_path2 = []
                output_frameidx1 = []
                output_frameidx2 = []

                for idx, (path1, path2) in enumerate(zip(path1_clip, path2_clip)):
                    if (path1, path2) in beit_pairs:
                        output_path1.append(path1)
                        output_path2.append(path2)
                        output_frameidx1.append(frameidx1_clip[idx])
                        output_frameidx2.append(frameidx2_clip[idx])

                return output_path1, output_path2, output_frameidx1, output_frameidx2

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An importing error occurred: {str(e)}")


@app.post("/", response_model=Result)
async def post_item(items: Item):
    path = []
    frame_idx = []
    print(items)

    items = jsonable_encoder(items)
    print(items)

    if items['query'][0]['metadata']:
        print('metadata search')
        folder_name, frame = items['query'][0]['metadata'].split(',')
        input = f"/mlcv2/WorkingSpace/Personal/longlb/AIC_2024/data/keyframe_resized/data-batch-1/{folder_name.strip()}/{frame.strip()}.webp"

        res = es.search(index="ocrtest2", query={
            'match' : {
                'path': {
                    'query': input,
                    }
                }
            }
        )    
        hits = res["hits"]["hits"]
        path = [hit['_source']['path'] for hit in hits]
        frame_idx = [hit['_source']['frameidx'] for hit in hits]
    
    elif items['query'][0]['imgPath']:
        items['query'][0]['imgPath'] = items['query'][0]['imgPath'].replace('http://localhost:3031','')
        print(items['query'][0]['imgPath'])
        path, frame_idx = image_embedded(items['query'][0]['imgPath'])
    
    elif items['query'][0]['asr']:
        print("asr search")
        
        res = es.search(index="asrtest1", query={
            'match' : {
                'asr': {
                    'query' : items['query'][0]['asr'],
                    'operator': "and",
                    'fuzziness' : "AUTO",
                }
            }
        },from_=0,size=1015)

        hits = res["hits"]["hits"]
        path = [hit['_source']['path'] for hit in hits]
        frame_idx = [hit['_source']['frameidx'] for hit in hits]
        
    elif items['query'][0]['ocr'] and not items['query'][0]['textual'] and not items['query'][0]['objects'] and not items['query'][0]['colors']:
        print("ocr search")
        res = es.search(index="ocrtest3", query={
            'match' : {
                'ocr': {
                    'query' : items['query'][0]['ocr'],
                    'operator': "and",
                    'fuzziness' : "AUTO"  ,
                }
            }
        },from_=0, size=1015)
        
        hits = res["hits"]["hits"]
        path = [hit['_source']['path'] for hit in hits]
        frame_idx = [hit['_source']['frameidx'] for hit in hits]    
        
    else:
        print('text search')
        selectedCollection = items['query'][0]['collection']
        
        print('the number of queries in the input data: ', len(items['query']))
        if len(items['query']) == 1:
            print("single query search")
            path,frame_idx = result(items['query'][0]['textual'], items['query'][0]['objects'], items['query'][0]['colors'],items['query'][0]['ocr'], selectedCollection=selectedCollection)
        else:
            print("temporal query search")
            path,path2,frame_idx,frame_idx2 = result(items['query'][0]['textual'], items['query'][0]['objects'], items['query'][0]['colors'],items['query'][0]['ocr'], items['query'][1]['textual'], items['query'][1]['objects'], items['query'][1]['colors'],items['query'][1]['ocr'], selectedCollection=selectedCollection)     
            
            return {"path": path,
                    "path2": path2,
                    "frame_idx": frame_idx,
                    "frame_idx2": frame_idx2}
    return {"path": path,
            "frame_idx": frame_idx}


@app.post("/random_pic",response_model=Result)
def random_pic():
    print('random pic search')
    with open("all.txt",'r') as f:
        lines = f.readlines()
        
    res = random.sample(lines, 203)
    path = []
    frame_idx = []
    
    for file in res:      
        path.append(file.strip())
        frame_idx.append(Path(file).stem)
    return {"path": path,
            "frame_idx": frame_idx}

# @app.post("/reprompt1",response_model=Reprompt)
# def reprompt1(prompt: PromptText):
#     prompt = jsonable_encoder(prompt)
#     genai.configure(api_key=os.environ["API_KEY"])

#     model = genai.GenerativeModel("gemini-1.5-flash")
#     repromptedText1 = model.generate_content(f"Given the following query: {prompt['prompt1']}, your task is to improve the wording (use key words) to optimize it for better image-text alignment in a CLIP model. Please provide only the revised query without any additional explanation or formatting.")
#     repromptedText2 = ""
#     if(prompt['prompt2']):
#         repromptedText2 = model.generate_content(f"Given the following query: {prompt['prompt2']}, your task is to improve the wording (use key words) to optimize it for better image-text alignment in a CLIP model. Please provide only the revised query without any additional explanation or formatting.")
#         print(repromptedText2.text)
#     print(repromptedText1.text)
#     return {"repromptedText1": repromptedText1.text,
#             "repromptedText2": repromptedText2.text if repromptedText2 else ''}
@app.post("/reprompt",response_model=Reprompt)
def reprompt(prompt: PromptText):
    MODEL = "gpt-4o"
    print(prompt)
    prompt = jsonable_encoder(prompt)
    
    repromptedText1 = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content":"You are trying to rephrase an optimal query for searching image frames and better image-text alignment in a text-to-image CLIP model."},
            {"role": "user", "content": [{"type": "text", "text": f"Given this query: {prompt['prompt1']}, try to improve the wording (use key words) to optimally rephrase it for better image-text alignment in a CLIP model. Provide only revised query in English without additional explanation or formatting."}]}
        ]
    )

    repromptedText2 = ''
    if prompt['prompt2']:
        repromptedText2 = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content":"You are trying to rephrase an optimal query for searching image frames and better image-text alignment in a text-to-image CLIP model."},
            {"role": "user", "content": [{"type": "text", "text": f"Given this query: {prompt['prompt2']}, try to improve the wording (use key words) to optimally rephrase it for better image-text alignment in a CLIP model. Provide only revised query in English without additional explanation or formatting."}]}
        ]
    )
    
    print(repromptedText1.choices[0].message.content)
    return {"repromptedText1": repromptedText1.choices[0].message.content,
            "repromptedText2": repromptedText2.choices[0].message.content if repromptedText2 else ""}
