from fastapi import APIRouter

from support import *
from pydantic import BaseModel

router = APIRouter()

def getNews():
    query = f"""
        SELECT id
        FROM games
        WHERE 
            release_date >= DATE_SUB(CURDATE(), INTERVAL 31 DAY) + TIME('23:00:00') AND
            release_date < CURDATE() - TIME('23:00:00');
    """

    results = executeQuery(query=query)
    pass

@router.post("/games/news")
def read_item():
    try:
        myNews = getNews()
        return myNews
    except Exception as e:
        return {"error": str(e)}