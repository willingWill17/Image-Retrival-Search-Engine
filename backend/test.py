from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class DataModel(BaseModel):
    canvas0: bool
    canvas1: bool

@app.post("/")
async def handle_post(data: DataModel):
    print(data)
    return {"message": "Data received successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.0", port=3131)
