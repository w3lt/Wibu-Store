from fastapi import APIRouter

from support import *
from routers.Body import Body

router = APIRouter()

def getNews(number):
    query = f"""
        SELECT id
        FROM games
        WHERE 
            release_date >= NOW() - INTERVAL 31 DAY + INTERVAL 23 HOUR AND
            release_date < NOW()
        LIMIT {number};
    """

    results = executeQuery(query=query)
    return [result[0] for result in results]



@router.post("/games/news")
def read_item(body: Body):
    try:
        myNews = getNews(body.number)
        return myNews
    except Exception as e:
        return {"error": str(e)}