const { execQuery, execGetQuery, execSetQuery, strToJSON } = require("../../support");

class Game {
    // +++ ------ Meta data ------ +++ //
    // private fields
    #gameID;
    #condition = `id='${this.#gameID}'`;
    #tableName = 'games';

    // constructor
    constructor(gameID) {
        try {
            const result = execGetQuery(this.#tableName, 'id', this.#condition);
            if (result.length !== 0) this.#gameID = gameID;
            else throw new Error("game ID does not exist");
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    // create talbe Games
    static async createMetaDataTable() {
        const query = `CREATE TABLE games (
            id INT AUTO_INCREMENT,
            title VARCHAR(255) NOT NULL,
            genres JSON,
            developers JSON,
            publisher INT,
            description TEXT,
            release_date DATETIME,
            size DECIMAL(5, 2),
            PRIMARY KEY (id),
            FOREIGN KEY (publisher) REFERENCES companies(id)
        )`;
        try {
            const result = await execQuery(query);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Game ID
    getGameID() {
        return this.#gameID;
    }

    // title
    async getTitle() {
        const getField = 'title';
        try {
            const result = await execGetQuery(this.#tableName, getField, this.#condition);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async setTitle(newTitle) {
        const setStatement = `title='${newTitle}'`;
        try {
            const result = await execSetQuery(this.#tableName, setStatement, this.#condition);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // genres
    async getGenres() {
        const getField = 'genres';
        try {
            const result = await execGetQuery(this.#tableName, getField, this.#condition);
            return result.split(', ');
        } catch (error) {
            throw error;
        }
    }

    async setGenres(genres) {
        var newGenres;

        if (typeof genres === "string") newGenres = genres;
        else newGenres = genres.join(', ');

        const setStatement = `genres='${newGenres}'`;
        try {
            const result = await execSetQuery(this.#tableName, setStatement, this.#condition);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async addGenres(newGenres) {
        try {
            const oldGenres = await this.getGenres();
            const genres = [...new Set([...oldGenres, ...newGenres])];

            const result = await this.setGenres(genres);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async removeGenres(removedGenres) {
        try {
            const oldGenres = await this.getGenres();
            removedGenres.forEach(genre => {
                oldGenres.splice(oldGenres.indexOf(genre), 1);
            })
            const genres = this.setGenres(oldGenres);
            return genres;
        } catch (error) {
            throw error;
        }
    }

    // developers
    async getDevelopers() {
        const getField = 'developers';
        try {
            const result = await execGetQuery(this.#tableName, getField, this.#condition);
            return result.split(', ');
        } catch (error) {
            throw error;
        }
    }

    async setDevelopers(developers) {
        var newDevelopers;

        if (typeof developers === "string") newDevelopers = developers;
        else newDevelopers = developers.join(', ');
        
        const setStatement = `developers='${newDevelopers}'`;
        try {
            const result = await execSetQuery(this.#tableName, setStatement, this.#condition);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async addDevelopers(newDevelopers) {
        try {
            const oldDevs = await this.getDevelopers();
            const devs = [...new Set([...oldDevs, ...newDevelopers])];

            const result = await this.setDevelopers(devs);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async removeDevelopers(removedDevelopers) {
        try {
            const oldDevs = await this.getDevelopers();
            removedDevelopers.forEach(dev => {
                oldDevs.splice(oldDevs.indexOf(dev), 1);
            })
            const devs = this.setDevelopers(oldDevs);
            return devs;
        } catch (error) {
            throw error;
        }
    }

    // publisher
    async getPublisher() {
        const getField = 'publisher';
        try {
            const result = await execGetQuery(this.#tableName, getField, this.#condition);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async setPublisher(newPublisher) {
        const setStatement = `publisher='${newPublisher}'`;
        try {
            const result = await execSetQuery(this.#tableName, setStatement, this.#condition);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // description
    async getDescription() {
        const getField = 'description';
        try {
            const result = await execGetQuery(this.#tableName, getField, this.#condition);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async setDescription(newDescription) {
        const setStatement = `description='${newDescription}'`;
        try {
            const result = await execSetQuery(this.#tableName, setStatement, this.#condition);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // release date
    async getReleaseDate() {
        const getField = 'release_date';
        try {
            const result = await execGetQuery(this.#tableName, getField, this.#condition);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async setReleaseDate(newReleaseDate) {
        const setStatement = `release_date='${newReleaseDate}'`;
        try {
            const result = await execSetQuery(this.#tableName, setStatement, this.#condition);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // meta data && store related information
    async getFullMetaData() {
        const query = `SELECT * FROM ${this.#tableName} WHERE ${this.#condition}`;
        try {
            const result = await execQuery(query);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    // +++ ------ Meta data ------ +++ //
    

    
    // +++ ------ Store-related data ------ ++ //
    #storeRelatedIn4TableName = 'gameStoreRelatedIn4';

    async getStoreRelatedInformation() {
        const query = `SELECT * FROM ${this.#storeRelatedIn4TableName} WHERE ${this.#condition}`;
        try {
            const result = await execQuery(query);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    async #getStoreRelatedData(getField) {
        try {
            const result = await execGetQuery(this.#storeRelatedIn4TableName, getField, this.#condition);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async #setStoreRelatedData(setStatement) {
        try {
            const result = await execSetQuery(this.#storeRelatedIn4TableName, setStatement, this.#condition);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async createGameStoreRelatedInformationTable() {
        const query = `CREATE TABLE gameStoreRelatedIn4 (
            id INT NOT NULL,
            reviews JSON,
            original_price DECIMAL(6, 2) NOT NULL,
            price DECIMAL(6, 2) NOT NULL,
            PRIMARY KEY (id),
            FOREIGN KEY (id) REFERENCES games(id)
        )`;
        try {
            const result = await execQuery(query);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // reviews
    async getReviews() {
        const getField = 'reviews';
        try {
            const result = await this.#getStoreRelatedData(getField);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async setReviews(reviews) {
        const reviewsStr = JSON.stringify(reviews);
        const setStatement = `reviews=${reviewsStr}`;
        try {
            const result = await this.#setStoreRelatedData(setStatement);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async addReviews(newReviews) {
        try {
            const oldReviews = await this.getReviews();
            const reviews = [... new Set([...oldReviews, ...newReviews])];
            const result = await this.setReviews(reviews);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async removeReviews(removedReviews) {
        try {
            const oldReviews = await this.getReviews();
            removedReviews.forEach(review => {
                oldReviews.splice(oldReviews.indexOf(review), 1);
            })
            const reviews = this.setDevelopers(oldReviews);
            return reviews;
        } catch (error) {
            throw error;
        }
    }

    // original price
    async getOriginalPrice() {
        const getField = 'original_price';
        try {
            const result = await this.#getStoreRelatedData(getField);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async setOriginalPrice(newOriginalPrice) {
        const setStatement = `original_price=${newOriginalPrice}`;
        try {
            const result = await this.#setStoreRelatedData(setStatement);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // price
    async getPrice() {
        const getField = 'price';
        try {
            const result = await this.#getStoreRelatedData(getField);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async setPrice(newPrice) {
        const setStatement = `price=${newPrice}`;
        try {
            const result = await this.#setStoreRelatedData(setStatement);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // -------------------------- //
    async getFullData() {
        const metaData = await this.getFullMetaData();
        const storeRelatedData = await this.getStoreRelatedInformation();
        const fullData = {...metaData, ...storeRelatedData};

        fullData.genres = strToJSON(fullData.genres);
        fullData.developers = strToJSON(fullData.developers);
        fullData.reviews = strToJSON(fullData.reviews);

        return fullData;
    }
}

exports.Game = Game;