import { server_main_route } from "./configs";

// function @execRequest is used to execute request
// @params: route, method, body
// return: response
async function execRequest() {
    const route = arguments[0];
    const method = arguments[1];

    let headers;
    let body = arguments[2]

    if (method === "GET") {
        headers = undefined;
    } else if (method === "POST") {
        headers = {'Content-Type': 'application/json'};
    }
    try {
        const response = await fetch(`${server_main_route}${route}`, {
            method: method,
            credentials: "include",
            headers: headers,
            body: body
        });

        const responseData = await response.json();
        if (responseData.status === 0) {
            delete responseData.status;
            return responseData;
        } else {
            throw new Error(responseData.error);
        }
    } catch (error) {
        throw error;
    }
}

async function checkSession() {
    try {
        const response = await fetch(`${server_main_route}/check-session`, {
            method: "GET",
            credentials: "include"
        });
    
        const data = await response.json();
        if (data.status === 0) return data.result;
        else console.log(data.error);
    } catch (error) {
        throw new Error(error);
    }
};

async function login(accountID, password) {
    try {
        const response = await fetch(`${server_main_route}/auth`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({accountID: accountID, password: password})
        });

        const responseData = await response.json();
        if (responseData.status === 0) {
            return {
                id: responseData.id,
                msg: responseData.msg
            }
        } else {
            throw new Error(responseData.error);
        }

    } catch (error) {
        throw error;
    }
}

async function register(email, username, password) {
    try {
        const response = await fetch(`${server_main_route}/register`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: email, username: username, password: password})
        });

        const responseData = await response.json();
        if (responseData.status === 0) {
            return {
                id: responseData.id,
                msg: responseData.msg
            }
        } else {
            throw new Error(responseData.error);
        }
    } catch (error) {
        throw error;
    }
}

async function logout() {
    try {
        const response = await fetch(`${server_main_route}/logout`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        if (data.status === 0) {
            return 0;
        } else {
            return data;
        }
    } catch (error) {
        throw new Error(error);
    }
}

async function fetchGameInfor(gameID) {
    const route = `/game/${gameID}`;
    const method = "GET";
    const result = await execRequest(route, method);
    if (result.id === 0) return result.data;
}

export {checkSession, login, register, logout, fetchGameInfor};