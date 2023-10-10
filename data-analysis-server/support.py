import mysql.connector
from configs import *
import redis
from redis.exceptions import ConnectionError



def executeQuery(query):
    connection = mysql.connector.connect(
        host=MYSQL_HOST,
        username=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DATABASE
    )

    

    try:
        cursor = connection.cursor()
        
        cursor.execute(query)
        if (query.strip()[:6].lower() != "select"):
            connection.commit()

        result = cursor.fetchall()        
        return result
    except Exception as e:
        print(e)

def saveToCache(key: str, data: list):
    try:
        redis_client = redis.Redis(host='redis', port=6379, db=0)
        redis_client.rpush(key, *data)
        redis_client.expire(key, 86400)
        redis_client.close()
    except ConnectionError as e:
        print(f"Error: Could not connect to Redis - {e}")
        