from fastapi import APIRouter

from support import *

router = APIRouter()

def getFreeToPlay():
    query = """
        SELECT games.* 
        FROM games
        JOIN gameStoreRelatedIn4
        ON games.id=gameStoreRelatedIn4.id 
        WHERE gameStoreRelatedIn4.price=0;
    """
    result = executeQuery(query=query)
    return result

@router.get("/games/free-to-play")
def read_item():
    try:
        myFreeToPlayGames = getFreeToPlay()
        return myFreeToPlayGames
    except Exception as e:
        return {"error": str(e)}