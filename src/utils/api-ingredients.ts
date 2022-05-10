import {URL} from "./parameters";
import {checkAnswer, checkSuccess} from "./api-common";

export const getIngredients = () => {
    return fetch(`${URL}/ingredients`)
        .then(checkAnswer)
        .then(checkSuccess);
}

