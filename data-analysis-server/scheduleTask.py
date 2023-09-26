import schedule
import datetime
import copy

from support import *
import time

def calculateTopsellers():
    query = f"""
        SELECT gameID, count(*) as sell_number
        FROM purchaseHistories
        GROUP BY gameID;
        WHERE 
            time >= (DATE_SUB(CURDATE(), INTERVAL 1 DAY) + TIME('23:00:00')) AND
            time < (CURDATE() + TIME('23:00:00'));
    """

    results = executeQuery(query=query)

    def insertInto(table):
        copy_results = copy.copy(results)

        match (table):
            case "topsellers_month":
                field = "month"
                current_time = time.strftime("%m/%Y")
            case "topsellers_quarter":
                field = "quarter"
                current_time = f"0{(datetime.date.today().month - 1) // 3 + 1}/{time.strftime('%Y')}"
            case "topsellers_year":
                field = "year"
                current_time = time.strftime("%Y")

        for i in range(len(copy_results)):
            copy_results[i] = list(copy_results[i])
            copy_results[i].reverse()
            copy_results[i].append(current_time)
            copy_results[i].reverse()
            copy_results[i] = tuple(copy_results[i])

        insertQuery = f"""
            INSERT INTO {table} ({field}, id, sell_number)
            VALUES {", ".join([str(result) for result in copy_results])}
            AS alias
            ON DUPLICATE KEY UPDATE {table}.sell_number = {table}.sell_number + alias.sell_number;
        """

        executeQuery(insertQuery)
                
    insertInto("topsellers_month")
    insertInto("topsellers_quarter")
    insertInto("topsellers_year")

schedule.every().day.at("23:30").do(calculateTopsellers)

while True:
    schedule.run_pending()