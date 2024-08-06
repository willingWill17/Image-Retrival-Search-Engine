from fastapi import FastAPI, Request, status
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from call2 import model, collection, tokenizer
from typing import List, Optional
import json
import os
import sys
from collections import defaultdict
import os 
from fastapi.templating import Jinja2Templates

sys.path.insert(0, "/mlcv2/WorkingSpace/Personal/longlb/AIC_2024/demo_system/unilm/beit3")


class Query(BaseModel):
    textual: Optional[str] = None
    objects: Optional[str] = None
    txt: Optional[str] = None

class Item(BaseModel):
    query: Optional[List[Query]] = None

class Result(BaseModel):
    path: Optional[List] = None
    frame_idx: Optional[List] = None
    vid_name: Optional[List] = None

origins = [
    "http://localhost:3031",
    "http://0.0.0.0:3031"
]

CHUNK_SIZE = 1024*1024

app = FastAPI()
templates = Jinja2Templates(directory="/mlcv2/WorkingSpace/Personal/longlb/AIC_2024/Image_Retrieval/frontend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

output = []

def result(query):
    from search import main
    query_str = json.dumps(query)
    os.environ["QUERY"] = query_str
    return main(query_str,collection,model,tokenizer)  

@app.post("/", response_model=Result)
async def post_item(items: Item):
    for item in items.query:
        query = {
            "textual": item.textual,
            "objects": item.objects,
            "txt": item.txt,
        }
        print(query)
        path, frame_idx = result(query)
        
    return {"path": path,
            "frame_idx": frame_idx }
