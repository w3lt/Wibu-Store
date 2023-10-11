const { createClient } = require("redis");
const { strToJSON } = require("./support");

class Cache {
    #client;

    constructor(url) {
        this.#client = createClient({url: url});
        this.#client.on('error', err => {
            console.error('Redis client error: ', err);
            this.#client.quit();
        })
    }

    async getData(key) {
        try {
            await this.#client.connect();
            const data = await this.#client.get(key);
            await this.#client.quit();
            if (data === null) return data;
            return strToJSON(data);
        } catch (error) {
            await this.#client.quit();
            throw error;
        }
        
    }

    async setData(key, data, expirationTime=86400) {
        try {
            await this.#client.connect();
            this.#client.setEx(key, expirationTime, JSON.stringify(data));
            await this.#client.quit();
            return true;
        } catch (error) {
            await this.#client.quit();
            console.log("Set Data Redis Error: ", error);
            return false;
        }
        
    }
}

exports.Cache = Cache;