from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

class Query(BaseModel):
    textual: str | None = None
    objects: str | None = None
    txt: str | None = None

class Item(BaseModel):
    query: list[Query] | None = None

class Result(Item):
    results: str = "Lmao"

origins = ["http://localhost:3031",
           "http://0.0.0.0:3031"]

app = FastAPI()

app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
)

@app.post("/", response_model=Result)
async def post_item(item: Item):
    return item
