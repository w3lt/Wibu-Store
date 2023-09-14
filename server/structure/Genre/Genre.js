const { execQuery, execGetQuery, execSetQuery } = require("../../support");

class Genre {
    #id;
    #tableName = 'genres';
    #condition = `id='${this.#id}'`;

    constructor(genreID) {
        this.#id = genreID;
    }

    static async createGenresTable() {
        const query = `CREATE TABLE genres (
            id INT AUTO_INCREMENT,
            title VARCHAR(255) NOT NULL,
            PRIMARY KEY (id)
        )`;
        try {
            const result = await execQuery(query);
            return result;
        } catch (error) {
            throw error;
        }
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
}

exports.Genre = Genre;