from fastapi import APIRouter
from support import *
from routers.Body import Body
import numpy as np

router = APIRouter()

def getTrending(number):
    query = f"""
        SELECT games.id, deliveriedTable.pre_order_number, gametrackers.last30daysview
        FROM games
        JOIN (
            SELECT gameID, count(*) AS pre_order_number FROM
            purchaseHistories
            -- WHERE time > NOW() - INTERVAL 31 DAY + INTERVAL 23 HOUR
            GROUP BY gameID
        ) AS deliveriedTable
        ON games.id = deliveriedTable.gameID
        JOIN gametrackers
        ON games.id = gametrackers.id
        WHERE games.release_date > NOW() - INTERVAL 31 DAY + INTERVAL 23 HOUR;
    """

    data = np.array(executeQuery(query=query))
    
    result = np.sqrt(np.square(0.9 * data[:, 1])+np.square(0.1 * data[:, 2]))
    data = np.concatenate([data[:, 0].reshape(-1, 1), result.reshape(-1, 1)], axis=1)
    # # data[1] -> buy number
    # # data[2] -> view number
    result = list(data[np.argsort(data[:, 1])][:number, 0])
    # saveToCache('top-upcoming')
    return result


@router.post("/games/top-upcoming")
def read_item(body: Body):
    try:
        result = getTrending(body.number)
        return result
    except Exception as e:
        return {"error": str(e)}