from fastapi import APIRouter

from support import *
from pydantic import BaseModel

router = APIRouter()

def getTopSellers(start_index, count):
    query = f"""
        SELECT id
        FROM topsellers
        ORDER BY sell_number DESC
        LIMIT {count} OFFSET {start_index};
    """
    result = executeQuery(query=query)
    print(result)
    return [column[0] for column in result]

class Body(BaseModel):
    start_index: int
    count: int

@router.post("/games/top-sellers")
def read_item(body: Body):
    try:
        myTopSellers = getTopSellers(body.start_index, body.count)
        return myTopSellers
    except Exception as e:
        return {"error": str(e)}