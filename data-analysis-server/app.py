# best deal for you
# free to play
# news & trending
# top sellers
# most played
# top up-coming

from fastapi import FastAPI
from routers import freeToPlay, bestDealForYou

from support import *



app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, World"}

app.include_router(freeToPlay.router)
app.include_router(bestDealForYou.router)