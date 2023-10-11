from fastapi import APIRouter
import json
import math
import numpy as np

from support import *
from routers.Body import Body

router = APIRouter()



def getBestDealForYou(uid, number):
    favorite_game_list_result = executeQuery(f"SELECT favorite_games FROM usertrackers WHERE {True if uid is None else uid}")
    favorite_game_list = json.loads(favorite_game_list_result[0][0])
    datas = []
    for gameID in favorite_game_list:
        data = list(executeQuery(f"""
            SELECT price, size, types, developers
            FROM games
            JOIN gameStoreRelatedIn4
            ON games.id = gameStoreRelatedIn4.id
            WHERE games.id={gameID};
        """)[0])

        data[0] = float(data[0])
        data[1] = float(data[1])
        data[2] = json.loads(data[2])
        data[3] = json.loads(data[3])

        datas.append(data)

    favorite_types = set(np.concatenate([data[2] for data in datas]))
    favorite_devs = set(np.concatenate([data[3] for data in datas]))

    datas = np.array([[data[0], data[1]] for data in datas])
    
    avg_price = np.mean(datas[:, 0])
    avg_size = np.mean(datas[:, 1])
    
    
    games = executeQuery(f"""
            SELECT games.id, price, size, types, developers
            FROM games
            JOIN gameStoreRelatedIn4
            ON games.id = gameStoreRelatedIn4.id
        """)
    
    
    best_deal_points = []
    
    for game in games:
        game = list(game)
        id = game[0]
        price = float(game[1])
        size = float(game[2])
        types = set(json.loads(game[3]))
        devs = set(json.loads(game[4]))

        delta_1 = 0 if types.intersection(favorite_types) else 1
        delta_2 = 0 if devs.intersection(favorite_devs) else 1

        best_deal_point = math.sqrt(0.55*((1-(price/avg_price))**2) + 0.15*((1-(size/avg_size))**2) + 0.15*delta_1 + 0.15*delta_2)
        best_deal_points.append([id, best_deal_point])


    
    best_deal_points = sorted(best_deal_points, key=lambda x: x[1])
    
    result = [best_deal_point[0] for best_deal_point in best_deal_points[0:number]]
    # saveToCache("best-deal-for-you", result)
    return result


@router.post("/games/best-deal-for-you")
def read_item(body: Body):
    try:
        bestDealForYou = getBestDealForYou(body.uid, body.number)
        return bestDealForYou
    except Exception as e:
        return {"error": str(e)}