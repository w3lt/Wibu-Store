const { execQuery, execGetQuery, execSetQuery } = require("../../support");

class Company {
    #id;
    #tableName = 'companies';
    #condition;

    constructor(companyID) {
        this.#id = companyID;
        this.#condition = `id='${this.#id}'`
    }

    static async createCompaniesTable() {
        const query = `CREATE TABLE companies (
            id INT AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            PRIMARY KEY (id)
        )`;
        try {
            const result = await execQuery(query);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // id
    getID() {
        return this.#id;
    }

    // name
    async getName() {
        const getField = 'name';
        try {
            const result = await execGetQuery(this.#tableName, getField, this.#condition);
            if (result.length !== 0) return result[0].name;
            else return null;
        } catch (error) {
            throw error;
        }
    }

    async setName(newName) {
        const setStatement = `name='${newName}'`;
        try {
            const result = await execSetQuery(this.#tableName, setStatement, this.#condition);
            return result
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
}

exports.Company = Company;