const bcrypt = require('bcryptjs');
const { execQuery, execGetQuery, execSetQuery, generateNewUID, dateToDatetime, convertPath2IMG } = require('../../support');
const { salt } = require('../../configs');

// Class of user
class User {
    // private fields
    #uid;
    #tableName = 'users';
    #condition;

    // constructor
    constructor(uid) {
        this.#uid = uid;
        this.#condition = `uid='${this.#uid}'`;
    }

    async get(...getFields) {
        try {
            const result = {};
            
            await Promise.all(getFields.map(async getField => {
                if (getField === "avatar") {
                    result[getField] = await this.getAvatar();
                } else {
                    const data = await execGetQuery(this.#tableName, getField, this.#condition);
                    if (result.length !== 0) result[getField] = data[0][getField];
                }
            }))
            
            return result;
        } catch (error) {
            throw error;
        }
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

    async getAvatar() {
        const getField = "avatar_path";
        try {
            const result = await execGetQuery(this.#tableName, getField, this.#condition);
            if (result.length !== 0) {
                const avatar = convertPath2IMG(`avatars/${result[0].avatar_path === null ? 'default_avatar.png' : result[0].avatar_path}`);
                return avatar;
            }
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
            if (result.length !== 0) return result[0].username;
            else return null;
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

    // method @authenticate is used to authenticate a login request
    // @params: accountID (username or email), password
    // @return: Int
    //      -> user infor if successfully authenticate
    //      -> false if not
    static async authenticate(accountID, password) {
        let accountIDField;
        const hashedPassword = bcrypt.hashSync(password, salt);
        
        if (accountID.includes('@')) accountIDField = 'email';
        else accountIDField = 'username';

        const query = `SELECT uid FROM users WHERE ${accountIDField}='${accountID}' AND password='${hashedPassword}'`;
        try {
            const result = await execQuery(query);
            if (result.length === 1) return result[0];
            else return false;
        } catch (error) {
            throw error;
        }
    }

    // method @registerNewUser is used to registered new user
    // @params: email, username, password
    // @return: Int
    //      -> 0 if successfully registered new user
    //      -> 1 both email and username is already registered
    //      -> 2 if username is already registered
    //      -> 3 if email is already registered if 
    static async registerNewUser(email, username, password) {
        const emailVerificationQuery = `SELECT uid FROM users WHERE email='${email}'`;
        const usernameVerificationQuery = `SELECT uid FROM users WHERE username='${username}'`;
        try {
            const emailVerificationResult = await execQuery(emailVerificationQuery);
            const usernameVerificationResult = await execQuery(usernameVerificationQuery);
            if (emailVerificationResult.length !== 0 && usernameVerificationResult.length !== 0) return 1;
            else if (usernameVerificationResult.length !== 0) return 2;
            else if (emailVerificationResult.length !== 0) return 3;
            else {
                const newUID = await generateNewUID();
                const hashedPassword = bcrypt.hashSync(password, salt);
                const registeringQuery = `INSERT INTO users (uid, email, username, password, created_at) 
                    VALUES (${newUID}, '${email}', '${username}', '${hashedPassword}', '${dateToDatetime(new Date())}')`;
                const result = await execQuery(registeringQuery);
                if (result) return 0;
            }
        } catch (error) {
            throw error;
        }
    }

    // method @checkSession is used to check if session exists
    // @params: sessionID
    // return: Boolean
    //      -> true if session exists
    //      -> false if not
    static async checkSession(sessionID) {
        const query = `SELECT * FROM sessions WHERE session_id='${sessionID}'`;
        try {
            const result = await execQuery(query);
            if (result.length !== 0) return true;
            else return false;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
exports.User = User;