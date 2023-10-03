const { execQuery, execGetQuery, execSetQuery } = require("../../support");

class Type {
    #id;
    #tableName = 'types';
    #condition;

    constructor(genreID) {
        this.#id = genreID;
        this.#condition = `id='${this.#id}'`;
    }

    static async createTypesTable() {
        const query = `CREATE TABLE types (
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
            if (result.length !== 0) return result[0].title;
            else return null;
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

exports.Type = Type;