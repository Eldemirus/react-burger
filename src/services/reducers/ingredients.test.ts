import thunk from "redux-thunk";
import createMockStore from "redux-mock-store";
import {AppDispatch} from "../store";
import {
  clearIngredientAmount,
  decIngredientAmount,
  getIngredientsFailed,
  getIngredientsStarted,
  getIngredientsSuccess,
  incIngredientAmount,
  ingredientSlice, loadIngredients,
  setIngredients
} from "./ingredients";
import fetchMock from "fetch-mock";
import {URL} from "../../utils/parameters";

const middlewares = [thunk];
export const mockStore = createMockStore<any, AppDispatch>(middlewares);

const initialState = {
  ingredients: [],
  ingredientsLoading: false,
  ingredientsFailed: false,
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
  amount: 2
}

test('should clear ingredient amount', () => {
  const prevState = {...initialState, ingredients: [ingredientMain]}
  let currentState = ingredientSlice.reducer(prevState, clearIngredientAmount());
  expect(currentState.ingredients[0].amount).toEqual(0);
})

test('should set ingredients started', () => {
  let currentState = ingredientSlice.reducer(initialState, getIngredientsStarted());
  expect(currentState.ingredientsLoading).toBeTruthy();
})

test('should set ingredients failed', () => {
  let currentState = ingredientSlice.reducer(initialState, getIngredientsFailed());
  expect(currentState.ingredientsLoading).toBeFalsy();
  expect(currentState.ingredientsFailed).toBeTruthy();
})

test('should set ingredients success', () => {
  let currentState = ingredientSlice.reducer(initialState, getIngredientsSuccess());
  expect(currentState.ingredientsLoading).toBeFalsy();
  expect(currentState.ingredientsFailed).toBeFalsy();
})

test('should set ingredients list', () => {
  let currentState = ingredientSlice.reducer(initialState, setIngredients([ingredientMain]));
  expect(currentState.ingredients).toEqual([ingredientMain]);
})

test('should increment ingredient amount', () => {
  const prevState = {...initialState, ingredients: [ingredientMain]}
  let currentState = ingredientSlice.reducer(prevState, incIngredientAmount(ingredientMain._id));
  expect(currentState.ingredients[0].amount).toEqual(3);
})

test('should decrement ingredient amount', () => {
  const prevState = {...initialState, ingredients: [ingredientMain]}
  let currentState = ingredientSlice.reducer(prevState, decIngredientAmount(ingredientMain._id));
  expect(currentState.ingredients[0].amount).toEqual(1);
})



describe('async actions', () => {
  afterEach(() => {
    fetchMock.restore()
  })

  it('success reset password', () => {
    const token = 'token';
    fetchMock.getOnce(`${URL}/ingredients`, {
          body: {success: true, data: [ingredientMain]},
        }
    )
    // Initialize mockstore with empty state
    const initialState = {auth: {token}, cart: {items:[]}};
    const store = mockStore(initialState)
    // Dispatch the action
    return store.dispatch(loadIngredients()).then(() => {
      // Test if your store dispatched the expected actions
      const actions = store.getActions()
      expect(actions).toContainEqual(ingredientSlice.actions.getIngredientsStarted())
      expect(actions).toContainEqual(ingredientSlice.actions.setIngredients([ingredientMain]))
      expect(actions).toContainEqual(ingredientSlice.actions.getIngredientsSuccess())
    })
  })
})


