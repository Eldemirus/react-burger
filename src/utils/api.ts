import {URL} from "./parameters";

const checkAnswer = (response: Response) => {
    if (response.ok) {
        return response.json()
    } else {
        response.json().then((error) => Promise.reject(error));
    }
}

export const getIngredients = () => {
    return fetch(`${URL}/ingredients`)
        .then(checkAnswer)
        .then(answer => {
            if (answer?.success) {
                return answer.data
            } else {
                return Promise.reject(answer);
            }
        });
}

export const sendOrder = (items: string[]) => {
    const body = {ingredients: items};
    return fetch(`${URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(checkAnswer)
        .then(answer => {
            if (answer?.success) {
                return answer;
            } else {
                return Promise.reject(answer);
            }
        });
}

