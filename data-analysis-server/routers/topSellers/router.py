from fastapi import APIRouter

from support import *

from routers.Body import Body

router = APIRouter()

def getTopSellers(period, start_index, count):
    query = f"""
        SELECT id
        FROM topsellers_{period}
        ORDER BY sell_number DESC
        LIMIT {count} OFFSET {start_index};
    """
    result = executeQuery(query=query)
    result = [column[0] for column in result]
    saveToCache('top-seller', result)
    return result

@router.post("/games/top-seller/{subfield}")
def read_item(body: Body, subfield: str):
    try:
        myTopSellers = getTopSellers(subfield, body.start_index, body.number)
        return myTopSellers
    except Exception as e:
        return {"error": str(e)}