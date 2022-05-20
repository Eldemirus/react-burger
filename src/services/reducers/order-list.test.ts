import {
  clearOrderList,
  getOrderListFailed,
  getOrderListStarted,
  getOrderListSuccess,
  onMessage,
  orderListSlice,
  setOrderList
} from './order-list';
import {AnyAction} from "redux";
import {Order} from "../../components/common/order";

import thunk from "redux-thunk";
import createMockStore from 'redux-mock-store';
import {AppDispatch} from "../store";

const initialState = {
  orders: [],
  total: 0,
  totalToday: 0,
  ordersLoading: false,
  ordersFailed: false,
}

test('should return the initial state', () => {
  expect(orderListSlice.reducer(undefined, {} as AnyAction)).toEqual({
    orders: [],
    total: 0,
    totalToday: 0,
    ordersLoading: false,
    ordersFailed: false,
  })
})

test('should set orderLoading and orderFailed', () => {
  const previousState = initialState
  let currentState = orderListSlice.reducer(previousState, getOrderListStarted());

  expect(currentState.ordersLoading).toEqual(true);
  expect(currentState.ordersFailed).toEqual(false);

  const currentState1 = orderListSlice.reducer(previousState, getOrderListFailed());

  expect(currentState1.ordersLoading).toEqual(false);
  expect(currentState1.ordersFailed).toEqual(true);

  const currentState2 = orderListSlice.reducer(previousState, getOrderListSuccess());

  expect(currentState2.ordersLoading).toEqual(false);
  expect(currentState2.ordersFailed).toEqual(false);

})


test('should set orders', () => {
  const orders: Array<Order> = [{
    _id: '123',
    items: [{
      id: '111222',
      index: 1,
      ingredient: {
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
    }]
  }];
  expect(orderListSlice.reducer(initialState, setOrderList(orders)).orders).toEqual(orders)
})
test('should clear orders', () => {
  const fullState = {
    total: 0,
    totalToday: 0,
    ordersLoading: false,
    ordersFailed: false,
    orders: [{
      _id: '123',
      items: [{
        id: '111222',
        index: 1,
        ingredient: {
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
      }]
    }]
  };
  expect(orderListSlice.reducer(fullState, clearOrderList()).orders).toEqual([])
})


const middlewares = [thunk];
export const mockStore = createMockStore<any, AppDispatch>(middlewares);

it('should dispatch actions', () => {

  // Initialize mockstore with empty state
  const initialState = {}
  const store = mockStore(initialState)
  const message: any = {
    total: 100,
    success: true,
    totalToday: 2000,
    orders: [{
      _id: '123',
      items: [{
        id: '111222',
        index: 1,
        ingredient: {
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
      }]
    }]
  };

  // Dispatch the action
  store.dispatch(onMessage(message));

  // Test if your store dispatched the expected actions
  const actions = store.getActions()
  expect(actions).toContainEqual(orderListSlice.actions.getOrderListSuccess())
  expect(actions).toContainEqual(orderListSlice.actions.setOrderList(message.orders))
  expect(actions).toContainEqual(orderListSlice.actions.setTotal(message.total))
  expect(actions).toContainEqual(orderListSlice.actions.setTotalToday(message.totalToday))

})

