import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Order} from "../../components/common/order";

export interface OrderListState {
  orders: Order[];
  total: number;
  totalToday: number;
  ordersLoading: boolean;
  ordersFailed: boolean;
}

const initialState: OrderListState = {
  orders: [
    // {
    //   "ingredients": [
    //     "60d3b41abdacab0026a733c6",
    //     "60d3b41abdacab0026a733c7",
    //     "60d3b41abdacab0026a733c7",
    //     "60d3b41abdacab0026a733ca",
    //     "60d3b41abdacab0026a733ca",
    //     "60d3b41abdacab0026a733cc",
    //     "60d3b41abdacab0026a733cc"
    //   ],
    //   "_id": "afsdfsadfasdfasdf",
    //   "status": "done",
    //   "name": "Death Star Starship Main бургер",
    //   "number": 123123,
    //   "createdAt": "2021-06-23T14:43:22.587Z",
    //   "updatedAt": "2021-06-23T14:43:22.603Z"
    // },
    // {
    //   "ingredients": [
    //     "60d3b41abdacab0026a733c6",
    //     "60d3b41abdacab0026a733c7",
    //     "60d3b41abdacab0026a733ca",
    //     "60d3b41abdacab0026a733cc"
    //   ],
    //   "_id": "afsdfsadfasdfasdf123123",
    //   "status": "created",
    //   "name": "Death Star Starship Main бургер",
    //   "number": 9999,
    //   "createdAt": "2021-06-23T14:43:22.587Z",
    //   "updatedAt": "2021-06-23T14:43:22.603Z"
    // },
    // {
    //   "ingredients": [
    //     "60d3b41abdacab0026a733c6",
    //     "60d3b41abdacab0026a733c7",
    //     "60d3b41abdacab0026a733ca",
    //     "60d3b41abdacab0026a733cc"
    //   ],
    //   "_id": "afsdfsadfasdfasdf123133",
    //   "status": "pending",
    //   "name": "Death Star Starship Main бургер",
    //   "number": 4444,
    //   "createdAt": "2021-06-23T14:43:22.587Z",
    //   "updatedAt": "2021-06-23T14:43:22.603Z"
    // },
    // {
    //   "ingredients": [
    //     "60d3b41abdacab0026a733c6",
    //     "60d3b41abdacab0026a733c7",
    //     "60d3b41abdacab0026a733c7",
    //     "60d3b41abdacab0026a733ca",
    //     "60d3b41abdacab0026a733cc"
    //   ],
    //   "_id": "afsdfsadfasdfasdf155555",
    //   "status": "pending",
    //   "name": "Death Star Starship Main бургер",
    //   "number": 5555,
    //   "createdAt": "2021-06-23T14:43:22.587Z",
    //   "updatedAt": "2021-06-23T14:43:22.603Z"
    // }
  ],
  total: 221,
  totalToday: 12,
  ordersLoading: false,
  ordersFailed: false,

}

export const orderListSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    getOrderListStarted: (state) => {
      state.ordersLoading = true;
      state.ordersFailed = false;
    },
    getOrderListFailed: (state) => {
      state.ordersLoading = false;
      state.ordersFailed = true;
    },
    getOrderListSuccess: (state) => {
      state.ordersLoading = false;
      state.ordersFailed = false;
    },
    setOrderList: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    setTotal: (state, action: PayloadAction<number>) => {
      state.total = action.payload;
    },
    setTotalToday: (state, action: PayloadAction<number>) => {
      state.totalToday = action.payload;
    },
    clearOrderList: (state) => {
      state.orders = [];
      state.total = 0;
      state.totalToday = 0;
    }
  }
})

const {actions} = orderListSlice;
export const {
  setOrderList,
  setTotal,
  setTotalToday,
  clearOrderList,
  getOrderListFailed,
  getOrderListStarted,
  getOrderListSuccess
} = actions;
