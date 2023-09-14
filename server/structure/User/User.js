const bcrypt = require('bcryptjs');
const { execQuery, execGetQuery, execSetQuery, generateNewUID, dateToDatetime } = require('../../support');

// Class of user
class User {
    // private fields
    #uid;
    #tableName = 'users';
    #condition = `uid='${this.#uid}'`;

    // constructor
    constructor(uid) {
        this.#uid = uid;
    }

    // UID
    async getUID() {
        const getField = 'uid';
        try {
            const result = await execGetQuery(this.#tableName, getField, this.#condition);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // email
    async getEmail() {
        const getField = 'email';
        try {
            const result = await execGetQuery(this.#tableName, getField, this.#condition);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async setEmail(newEmail) {
        const setStatement = `email='${newEmail}'`;
        try {
            const result = await execSetQuery(this.#tableName, setStatement, this.#condition);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // username
    async getUsermame() {
        const getField = 'username';
        try {
            const result = await execGetQuery(this.#tableName, getField, this.#condition);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async setUsername(newUsername) {
        const setStatement = `username='${newUsername}'`;
        try {
            const result = await execSetQuery(this.#tableName, setStatement, this.#condition);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // password
    async #getHashedPassword() {
        const getField = 'password';
        try {
            const result = await execGetQuery(this.#tableName, getField, this.#condition);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async #setHashedPassword(newHashedPassword) {
        const setStatement = `password='${newHashedPassword}'`;
        try {
            const result = await execSetQuery(this.#tableName, setStatement, this.#condition);
            return result;
        } catch (error) {
            throw error;
        }
    }
    
    async changePassword(oldPassword, newPassword) {
        try {
            const myHashedPassword = this.#getHashedPassword();
            const result = bcrypt.compareSync(oldPassword, myHashedPassword);
            if (result) {
                const newHashedPassword = bcrypt.hashSync(newPassword, 10);
                await this.#setHashedPassword(newHashedPassword);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            throw error;
        }
    }

    // gender
    async getGender() {
        const getField = 'gender';
        try {
            const result = await execGetQuery(this.#tableName, getField, this.#condition);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async setGender(newGender) {
        const setStatement = `gender=${newGender}`;
        try {
            const result = await execSetQuery(this.#tableName, setStatement, this.#condition);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // date of birth
    async getDOB() {
        const getField = 'dob';
        try {
            const result = await execGetQuery(this.#tableName, getField, this.#condition);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async setDOB(newDOB) {
        const setStatement = `dob=${newDOB}`;
        try {
            const result = await execSetQuery(this.#tableName, setStatement, this.#condition);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // creation date
    async getCreationDate() {
        const getField = 'created_at';
        try {
            const result = await execGetQuery(this.#tableName, getField, this.#condition);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getFullMetaData() {
        const query = `SELECT * FROM ${this.#tableName} WHERE ${this.#condition}`;
        try {
            const result = await execQuery(query);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // create table users
    static async createUsersTable() {
        const query = `CREATE TABLE users (
            uid INT UNSIGNED,
            email VARCHAR(255),
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            gender TINYINT,
            dob DATETIME,
            created_at DATETIME NOT NULL,
            PRIMARY KEY (uid),
            UNIQUE (email),
            UNIQUE (password)
        )`;
        try {
            const result = await execQuery(query);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async authenticate(accountID, password) {
        let accountIDField;
        
        if (accountID.includes('@')) accountIDField = 'email';
        else accountIDField = 'username';

        const query = `SELECT uid FROM users WHERE ${accountIDField}=${accountID} AND password=${password}`;
        try {
            const result = await execQuery(query);
            if (result) return true;
            else return false;
        } catch (error) {
            throw error;
        }
    }

    // method registerNewUser is used to registered new user
    // @params: email, username, password
    // @return: Int
    //      -> 0 if successfully registered new user
    //      -> 1 if email is already registered
    //      -> 2 if username is already registered
    //      -> 3 if both email and username is already registered
    static async registerNewUser(email, username, password) {
        const emailVerificationQuery = `SELECT uid FROM users WHERE email='${email}'`;
        const usernameVerificationQuery = `SELECT uid FROM users WHERE username='${username}'`;
        try {
            const emailVerificationResult = await execQuery(emailVerificationQuery);
            const usernameVerificationResult = await execQuery(usernameVerificationQuery);
            console.log(emailVerificationResult.length);
            console.log(usernameVerificationResult.length);
            if (emailVerificationResult.length !== 0 && usernameVerificationResult.length !== 0) return 3;
            else if (emailVerificationResult.length !== 0) return 2;
            else if (usernameVerificationResult.length !== 0) return 1;
            else {
                const newUID = await generateNewUID();
                const registeringQuery = `INSERT INTO users (uid, email, username, password, created_at) 
                    VALUES (${newUID}, '${email}', '${username}', '${password}', '${dateToDatetime(new Date())}')`;
                const result = await execQuery(registeringQuery);
                console.log(result);
                if (result) return 0;
            }
        } catch (error) {
            throw error;
        }
    }
}

exports.User = User;