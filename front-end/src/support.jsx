import { server_main_route } from "./configs"

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

async function fetchContact() {
    try {
        const response = await fetch(`${server_main_route}/my-contacts`, {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error);
    }
}

async function sendMessage(sender, receiver, content) {
    try {
        const response = await fetch(`${server_main_route}/message`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({sender: sender, receiver: receiver, content: content})
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

// index indicate which type of notification need to be fetch
// 0 -> friend request
async function fetchNotification(index) {
    let type;
    switch (index) {
        case 0:
            type = "friend-requests";
            break;
    }

    try {
        const response = await fetch(`${server_main_route}/notifications/${type}`, {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json();
        if (data.status === 0) {
            return data.data;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        throw new Error(error);
    }
}

async function readNotifications(index) {
    let type;
    switch (index) {
        case 0:
            type = "friend-requests";
            break;
    }
    try {
        const response = await fetch(`${server_main_route}/notifications/${type}`, {
            method: "POST",
            credentials: "include",
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

async function fetchNumberUnreadNotification() {
    try {
        const response = await fetch(`${server_main_route}/notifications`, {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json();
        if (data.status === 0) {
            return data.numberUnreadNotification;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        throw new Error(error);
    }
}

async function searchPeople(searchingName) {
    try {
        const response = await fetch(`${server_main_route}/people/${searchingName}`, {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json();
        if (data.status === 0) {
            return data.data;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        throw new Error(error);
    }
}

async function requestFriendRelationship(username) {
    try {
        const response = await fetch(`${server_main_route}/friends`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({receiver: username})
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

async function handleFriendRequest(sender, type) {
    try {
        const response = await fetch(`${server_main_route}/friend-request`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({sender: sender, type: type})
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

async function cancelFriendRequest(username) {
    try {
        const response = await fetch(`${server_main_route}/friends`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({receiver: username})
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

async function createGroup(groupName, visibility) {
    try {
        const response = await fetch(`${server_main_route}/group`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({groupName: groupName, visibility: visibility})
        });

        const data = await response.json();
        if (data.status === 0) {
            console.log(data.result);
            return 0;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        throw new Error(error);
    }
}

export {checkSession, login, register, logout, fetchContact, sendMessage,
    fetchNotification, searchPeople, requestFriendRelationship, handleFriendRequest,
    fetchNumberUnreadNotification, readNotifications, cancelFriendRequest,
    createGroup
};