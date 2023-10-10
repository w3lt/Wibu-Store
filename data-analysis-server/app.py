# best deal for you
# free to play
# news & trending
# top sellers
# most played
# top up-coming

from fastapi import FastAPI
from routers.bestDealForYou.router import router as bestDealForYouRouter
from routers.freeToPlay.router import router as freeToPlayRouter
from routers.topSellers.router import router as topSellerRouter
from routers.news.route import router as newRouter
from routers.trending.router import router as trendingRouter
from routers.topUpcoming.router import router as topUpcomingRouter

from support import *

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, World"}

app.include_router(topSellerRouter)
app.include_router(bestDealForYouRouter)
app.include_router(freeToPlayRouter)
app.include_router(newRouter)
app.include_router(trendingRouter)
app.include_router(topUpcomingRouter)