from fastapi import APIRouter

from support import *
from pydantic import BaseModel

router = APIRouter()

def getFreeToPlay(number):
    query = f"""
        SELECT games.* 
        FROM games
        JOIN gameStoreRelatedIn4
        ON games.id=gameStoreRelatedIn4.id 
        WHERE gameStoreRelatedIn4.price=0
        LIMIT {number};
    """
    result = executeQuery(query=query)
    return [column[0] for column in result]

class Body(BaseModel):
    number: int

@router.post("/games/free-to-play")
def read_item(body: Body):
    try:
        myFreeToPlayGames = getFreeToPlay(body.number)
        return myFreeToPlayGames
    except Exception as e:
        return {"error": str(e)}