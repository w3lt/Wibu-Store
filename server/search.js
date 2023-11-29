const { searchServerURL } = require("./configs");

class SearchClient {
    #serverURL;
    constructor() {
        this.#serverURL = searchServerURL;
    }

    async search(keyword, type) {
        try {
            const response = await fetch(`${this.#serverURL}/${type ? type : ""}`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({keyword: keyword})
            });
    
            const data = await response.json();
            if (data.status !== 0) {
                throw data.error;
            } else {
                return data.data;
            }
        } catch (error) {
            throw error;
        }
        
    }
}

exports.SearchClient = SearchClient;