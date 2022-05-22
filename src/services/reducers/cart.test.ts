import thunk from "redux-thunk";
import createMockStore from "redux-mock-store";
import {AppDispatch} from "../store";
import {setUser, User} from "./auth";
import {addOrderItem, cartSlice, clearOrderItems, deleteOrderItem, swapOrderItems} from "./cart";

const middlewares = [thunk];
export const mockStore = createMockStore<any, AppDispatch>(middlewares);

const initialState = {
  items: [],
}
const user: User = {email: 'email', name: 'name'};

const ingredientBun = {
  "_id": "60d3b41abdacab0026a733c6",
      "name": "Краторная булка N-200i",
      "type": "bun",
      "proteins": 80,
      "fat": 24,
      "carbohydrates": 53,
      "calories": 420,
      "price": 1255,
      "image": "https://code.s3.yandex.net/react/code/bun-02.png",
      "image_mobile": "https://code.s3.yandex.net/react/code/bun-02-mobile.png",
      "image_large": "https://code.s3.yandex.net/react/code/bun-02-large.png",
      "__v": 0,
      amount: 0
}

const ingredientMain = {
  "_id": "6123123123123123123",
      "name": "Краторная булка N-200i",
      "type": "main",
      "proteins": 80,
      "fat": 24,
      "carbohydrates": 53,
      "calories": 420,
      "price": 1255,
      "image": "https://code.s3.yandex.net/react/code/bun-02.png",
      "image_mobile": "https://code.s3.yandex.net/react/code/bun-02-mobile.png",
      "image_large": "https://code.s3.yandex.net/react/code/bun-02-large.png",
      "__v": 0,
      amount: 0
}


test('should add main ingredient to order', () => {
  const id = 'asdfasdfasdf';
  let currentState = cartSlice.reducer(initialState, addOrderItem({ingredient: ingredientMain, id}));
  expect(currentState.items).toEqual([{ingredient: ingredientMain, id}]);
})

test('should add bun ingredient to order', () => {
  const id = 'asdfasdfasdf';
  let currentState = cartSlice.reducer(initialState, addOrderItem({ingredient: ingredientBun, id}));
  expect(currentState.bunItem).toEqual({ingredient: ingredientBun, id});
  expect(currentState.items).toEqual([]);
})

test('should delete main ingredient from order', () => {
  const id = 'asdfasdfasdf';
  const previousState = {...initialState, items: [{ingredient: ingredientMain, id}]};
  let currentState = cartSlice.reducer(previousState, deleteOrderItem({ingredient: ingredientMain, id}));
  expect(currentState.bunItem).toBeUndefined();
  expect(currentState.items).toEqual([]);
})

test('should swap two ingredients from order', () => {
  const id1 = 'asdfasdfasdf1';
  const id2 = 'asdfasdfasdf2';
  const ingredient1 = {ingredient: {...ingredientMain}, id: id1, index: 0}
  const ingredient2 = {ingredient: {...ingredientMain}, id: id2, index: 1}
  const previousState = {...initialState, items: [ingredient1, ingredient2]};
  let currentState = cartSlice.reducer(previousState, swapOrderItems({from: 0, to: 1}));
  expect(currentState.items).toEqual([{...ingredient2, index: 0},{...ingredient1, index: 0}]);
})

test('should clear order items', () => {
  const id = 'asdfasdfasdf';
  const previousState = {...initialState, items: [{ingredient: ingredientMain, id}]};
  let currentState = cartSlice.reducer(previousState, clearOrderItems());
  expect(currentState.items).toEqual([]);
})

