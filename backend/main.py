from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


class Item(BaseModel):
    scene_description: str
    next_scene_description: str | None=None
    canvas0: bool
    occur0: str
    canvas1: bool
    occur1: str
    url: str | None=None

origins = ["http://0.0.0.0:3000"]

app = FastAPI()

app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
)


@app.post("/")
async def add_item(item: Item):
    return item
