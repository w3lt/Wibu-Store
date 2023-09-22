from fastapi import APIRouter

from support import *

router = APIRouter()

def getBestDealForYou():
    query = """
        SELECT games.* 
        FROM games
        JOIN gameStoreRelatedIn4
        ON games.id=gameStoreRelatedIn4.id 
        WHERE gameStoreRelatedIn4.price=0;
    """
    result = executeQuery(query=query)
    return result

@router.get("/games/best-deal-for-yoy")
def read_item():
    try:
        bestDealForYou = getBestDealForYou()
        return bestDealForYou
    except Exception as e:
        return {"error": str(e)}