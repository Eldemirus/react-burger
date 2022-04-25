import {URL} from "./parameters";
import {checkAnswer, checkSuccess} from "./api-common";

export const sendOrder = (items: string[], token: string) => {
  const body = {ingredients: items};
  return fetch(`${URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  })
      .then(checkAnswer)
      .then(checkSuccess);
}