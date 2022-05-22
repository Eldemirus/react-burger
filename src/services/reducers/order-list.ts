import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Order} from "../../components/common/order";

export interface OrderListState {
  orders: Order[];
  total: number;
  totalToday: number;
  ordersLoading: boolean;
  ordersFailed: boolean;
}

const initialState: OrderListState = {
  orders: [],
  total: 0,
  totalToday: 0,
  ordersLoading: false,
  ordersFailed: false,

}

export const orderListSlice = createSlice({
  name: 'order-list',
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
  },
  extraReducers: builder => {
    builder.addCase(onMessage.pending, (state, action) => {
    })
    builder.addCase(onMessage.fulfilled, (state, action) => {
    })
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


export const onMessage = createAsyncThunk(
    'order-list/onMessage',
    async (message: any, {dispatch}) => {
      if (message.success) {
        dispatch(setOrderList(message.orders));
        dispatch(setTotal(message.total));
        dispatch(setTotalToday(message.totalToday));
        dispatch(getOrderListSuccess())
      } else {
        dispatch(clearOrderList());
        dispatch(getOrderListFailed());
      }
    }
)


