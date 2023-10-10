from fastapi import APIRouter
from support import *
from routers.Body import Body
import numpy as np

router = APIRouter()

def getTrending(number):
    query = f"""
        SELECT gametrackers.*, derivedTable.sell_number
        FROM gametrackers
        JOIN (
            SELECT gameID, count(*) as sell_number
            FROM purchaseHistories
            GROUP BY gameID
        ) AS derivedTable
        ON gametrackers.id = derivedTable.gameID;
    """

    data = np.array(executeQuery(query=query))
    
    result = data[:, 1]+np.sqrt(0.3*np.square(data[:, 2]) + 0.7*np.square(data[:, 3]))
    result = np.concatenate([data[:, 0].reshape(-1, 1), result.reshape(-1, 1)], axis=1)
    # data[1] -> views
    # data[2] -> loves
    # data[3] -> buys number
    return list(result[np.argsort(result[:, 1])][:number, 0])


@router.post("/games/trending")
def read_item(body: Body):
    try:
        result = getTrending(body.number)
        return result
    except Exception as e:
        return {"error": str(e)}