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
            body: JSON.stringify(body)
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
    const route = `/check-session`;
    const method = "GET";
    try {
        const result = await execRequest(route, method);
        if (result.id === 0) {
            return {result: true, uid: result.data.uid};
        }
        else {
            return {result: false};
        };
    } catch (error) {
        throw error;
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
            throw new Error(data.error);
        }
    } catch (error) {
        throw new Error(error);
    }
}

async function fetchGameInfor(gameID) {
    const route = `/games/${gameID}`;
    const method = "GET";
    try {
        const result = await execRequest(route, method);
        if (result.id === 0) return result.data;
        else console.log(result.msg);
    } catch (error) {
        throw error;
    }
}

async function fetchUserInfor(UID, getField) {
    const route = `/users/${UID}/${getField}`;
    const method = "GET";
    try {
        const result = await execRequest(route, method);
        if (result.id === 0) return result.data;
        else console.log(result.msg);
    } catch (error) {
        throw error;
    }
}

async function getTopBanners() {
    const route = '/top-banners';
    const method = "GET";
    try {
        const result = await execRequest(route, method);
        if (result.id === 0) return result.data;
        else console.log(result.msg);
    } catch (error) {
        throw error;
    }
}

async function getDatas(dataType, number=5, start_index=0) {
    const route = `/datas/${dataType}`;
    const method = "POST";
    try {
        const result = await execRequest(route, method, {number: number, start_index: start_index});
        if (result.id === 0) return result.data;
        else console.log(result.msg);
    } catch (error) {
        throw error;
    }
}

async function search(keyword) {
    const route = "/search";
    const method = "POST";
    try {
        const result = await execRequest(route, method, {keyword: keyword});
        console.log(result);
        if (result.id === 0) return result.data;
        else console.log(result.msg);
    } catch (error) {
        throw error;
    }
}

function displayPrice(price) {
    return (price === 0 ? "Free" : `$${price}`)
}

export {checkSession, login, register, logout, execRequest, fetchGameInfor, fetchUserInfor,
        getTopBanners, getDatas, displayPrice, search};