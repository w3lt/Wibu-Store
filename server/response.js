class Response {
    #msg;
    #error;
    #data;

    // @params: status, id, error
    constructor () {
        const status = arguments[0];
        this.status = status;

        if (status === 0) { // status = 0 => no error
            const id = arguments[1];
            const data = arguments[2]

            this.#error = undefined;
            this.id = id;
            this.#data = data;
            this.#msg = responses[id].msg;
        } else if (status === 1) { // status = 1 => error
            this.#msg = undefined;
            this.id = undefined;
            this.#error = "server internal error";
        }
    }

    getMSG() {
        return this.#msg;
    }

    getError() {
        return this.#error;
    }

    getData() {
        return this.#data;
    }

    toJSON() {
        return {
            status: this.status,
            id: this.id,
            msg: this.#msg,
            error: this.#error,
            data: this.#data
        }
    }
}
exports.Response = Response;

const responses = [
    {id: 0, msg: "successfully"},
    // +++ ------------------------------------- +++ //
    // response for register request
    {id: 1, msg: "email and username have been registered!"},
    {id: 2, msg: "username has been registered!"},
    {id: 3, msg: "email has been registered!"},
    // +++ ------------------------------------- +++ //
    // response for login request
    {id: 4, msg: "email or password incorrect!"},
    // +++ ------------------------------------- +++ //
    // response for check session
    {id: 5, msg: "user unauthorized!"}
]