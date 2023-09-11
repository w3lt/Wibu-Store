const userModel = require("./dbModel").model;


// Class of user
class User {
    // private fields
    #uid
    #email;
    #username;
    #password;
    #gender;
    #dob;
    #created_at;

    constructor(uid, email, username, password, gender, dob, created_at) {
        this.#uid = uid;
        this.#email = email;
        this.#username = username;
        this.#password = password;
        this.#gender = gender;
        this.#dob = dob;
        this.#created_at = created_at;
    }

    getUID() {
        return this.#uid;
    }

    getEmail() {
        return this.#email;
    }

    async setEmail(newEmail) {
        try {
            const result = await userModel.updateOne({uid: this.#uid}, {email: newEmail});
            if (result.acknowledged) {
                this.#email = newEmail;
                return true;
            }
            else return false;
        } catch (error) {
            throw error;
        }
    }

    getUsermame() {
        return this.#username;
    }

    async setUsername(newUsername) {
        try {
            const result = await userModel.updateOne({uid: this.#uid}, {username: newUsername});
            if (result.acknowledged) {
                this.#username = newUsername;
                return true;
            }
            else return false;
        } catch (error) {
            throw error;
        }
    }

    async changePassword(oldPassword, newPassword) {
        if (this.#password.localeCompare(oldPassword) === 0) {
            try {
                const result = await userModel.updateOne({uid: this.#uid}, {password: newPassword})
                if (result.acknowledged) {
                    this.#password = newPassword;
                    return true;
                }
            } catch (error) {
                throw error;
            }
        } else return false;
    }

    getGender() {
        return this.#gender;
    }

    async setGender(newGender) {
        try {
            const result = await userModel.updateOne({uid: this.#uid}, {gender: newGender});
            if (result.acknowledged) {
                this.#gender = newGender;
                return true;
            }
            else return false;
        } catch (error) {
            throw error;
        }
    }

    getDOB() {
        return this.#dob;
    }

    async setDOB(newDOB) {
        try {
            const result = await userModel.updateOne({uid: this.#uid}, {dob: newDOB});
            if (result.acknowledged) {
                this.#dob = newDOB;
                return true;
            }
            else return false;
        } catch (error) {
            throw error;
        }
    }

    getCreationDate() {
        return this.#created_at;
    }

    static async fetchUser(uid) {
        try {
            const user = await userModel.findOne({uid: uid});
            if (user) {
                return new User(user.uid, user.email, user.username, user.password, user.gender, user.dob, user.created_at);
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    }
}

exports.User = User;