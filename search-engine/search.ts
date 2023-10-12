import mysql from "mysql";
import { MYSQL_HOST, MYSQL_PASSWORD, MYSQL_USER, db } from "./configs";


class Search {
    private pool: mysql.Pool;
    constructor() {
        this.pool = mysql.createPool({
            connectionLimit: 10,
            database: db,
            host: MYSQL_HOST,
            user: MYSQL_USER,
            password: MYSQL_PASSWORD,
            port: 3306
        })
    }

    private execQuerty(query: string) {
        return new Promise((resolve, reject) => {
            this.pool.query(query, (error, result) => {
                if (error) return reject(error);
                return resolve(result);
            })
        })
    }

    public async searchOnGame(keyword: string) {
        const query = `
            SELECT id FROM games
            WHERE MATCH(title, description) AGAINST('${keyword}' IN BOOLEAN MODE);
        `;
        try {
            const result = await this.execQuerty(query);
            return result;
        } catch (error) {
            throw error;
        }
        
    }
}

export default Search;