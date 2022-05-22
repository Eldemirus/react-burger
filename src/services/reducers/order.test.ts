import thunk from "redux-thunk";
import createMockStore from "redux-mock-store";
import {AppDispatch} from "../store";
import fetchMock from "fetch-mock";
import {URL} from "../../utils/parameters";
import {
  clearOrder,
  clearOrderThunk,
  orderSlice,
  sendOrderFailed,
  sendOrderStarted, sendOrderSuccess,
  sendOrderThunk,
  setOrder
} from "./order";
import {cartSlice} from "./cart";
import {ingredientSlice} from "./ingredients";

const middlewares = [thunk];
export const mockStore = createMockStore<any, AppDispatch>(middlewares);

const initialState = {
  orderSending: false,
  orderFailed: false,
}

test('should clear order', () => {
  const prevState = {...initialState, order: {}}
  let currentState = orderSlice.reducer(prevState, clearOrder());
  expect(currentState.order).toBeUndefined();
})

test('should set order', () => {
  const prevState = {...initialState, order: {}}
  const order = {id: '123', number: 999, status: 'created'};
  let currentState = orderSlice.reducer(prevState, setOrder(order));
  expect(currentState.order).toEqual(order);
})

test('should start set order', () => {
  let currentState = orderSlice.reducer(initialState, sendOrderStarted());
  expect(currentState.orderSending).toBeTruthy();
  expect(currentState.orderFailed).toBeFalsy();
})

test('should fail set order', () => {
  let currentState = orderSlice.reducer(initialState, sendOrderFailed());
  expect(currentState.orderSending).toBeFalsy();
  expect(currentState.orderFailed).toBeTruthy();
})

test('should success set order', () => {
  let currentState = orderSlice.reducer(initialState, sendOrderSuccess());
  expect(currentState.orderSending).toBeFalsy();
  expect(currentState.orderFailed).toBeFalsy();
})




describe('async actions', () => {
  afterEach(() => {
    fetchMock.restore()
  })

  it('should clear order state', () => {
    const store = mockStore(initialState)
    // Dispatch the action
    return store.dispatch(clearOrderThunk()).then(() => {
      // Test if your store dispatched the expected actions
      const actions = store.getActions()
      expect(actions).toContainEqual(orderSlice.actions.clearOrder())
      expect(actions).toContainEqual(cartSlice.actions.clearOrderItems())
      expect(actions).toContainEqual(ingredientSlice.actions.clearIngredientAmount())
    })
  })

  it('success reset password', () => {
    const token = 'token';
    const order = {order: {number: '111-111'}, name: 'name'};
    fetchMock.postOnce(`${URL}/orders`, {
          body: {success: true, ...order},
        }
    )
    // Initialize mockstore with empty state
    const initialState = {auth: {token}, cart: {items:[]}};
    const store = mockStore(initialState)
    // Dispatch the action
    return store.dispatch(sendOrderThunk()).then(() => {
      // Test if your store dispatched the expected actions
      const actions = store.getActions()
      expect(actions).toContainEqual(orderSlice.actions.sendOrderStarted())
      expect(actions).toContainEqual(orderSlice.actions.sendOrderSuccess())
      expect(actions).toContainEqual(orderSlice.actions.setOrder({id: order.order.number, name: order.name}))
    })
  })
})


