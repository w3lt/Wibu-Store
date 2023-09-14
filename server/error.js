const errors = [
    {id: 0, msg: "internal error"},
    {id: 1, msg: "email is already registered"},
    {id: 2, msg: "username has already existed"}
];

class Error {
    #msg;

    constructor(id) {
        this.id = id;
        this.#msg = errors[id].msg;
    }

    getMSG() {
        return this.#msg;
    }
};
exports.Error = Error;

