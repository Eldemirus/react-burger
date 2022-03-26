import {URL} from "./parameters";
import {checkAnswer, checkSuccess} from "./api-common";

export const getIngredients = () => {
    return fetch(`${URL}/ingredients`)
        .then(checkAnswer)
        .then(checkSuccess);
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
        .then(checkSuccess);
}

