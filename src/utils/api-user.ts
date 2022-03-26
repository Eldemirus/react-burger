import {URL} from "./parameters";
import {checkAnswer, checkSuccess} from "./api-common";
import {User} from "../services/reducers/auth";

export const passwordReset = (email: string) => {
    const body = {email};
    return fetch(`${URL}/password-reset`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(checkAnswer)
        .then(checkSuccess);
}

export const passwordResetConfirmation = (password: string, token: string) => {
    const body = {password, token};
    return fetch(`${URL}/password-reset/reset`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(checkAnswer)
        .then(checkSuccess);
}

export const registerUser = (email: string, password: string, name: string) => {
    const body = {email, password, name};
    return fetch(`${URL}/auth/register`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(checkAnswer)
        .then(checkSuccess);
}

export const loginUser = (email: string, password: string) => {
    const body = {email, password};
    return fetch(`${URL}/auth/login`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(checkAnswer)
        .then(checkSuccess);
}

export const logoutUser = (token: string) => {
    const body = {token};
    return fetch(`${URL}/auth/logout`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(checkAnswer)
        .then(checkSuccess);
}

export const getAccessToken = (token: string) => {
    const body = {token};
    return fetch(`${URL}/auth/token`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(checkAnswer)
        .then(checkSuccess);
}

export const getUserInfo = (token: string) => {
    return fetch(`${URL}/auth/user`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
        .then(checkAnswer)
        .then(checkSuccess);
}

export const saveUserInfo = (user: User, token: string) => {
    return fetch(`${URL}/auth/user`,{
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(user)
    })
        .then(checkAnswer)
        .then(checkSuccess);
}

