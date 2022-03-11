import {createAsyncThunk, createSlice, Draft, PayloadAction} from "@reduxjs/toolkit";
import {Order} from "../../components/common/order";
import {clearIngredientAmount} from "./ingredients";
import {sendOrder} from "../../utils/api";
import {RootState} from "../store";
import {clearOrderItems} from "./cart";

export interface OrderState {
    order?: Order;
    orderSending: boolean;
    orderFailed: boolean;
}

const initialState: OrderState = {
    orderSending: false,
    orderFailed: false,
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        clearOrder: (state) => {
            state.order = undefined;
        },
        setOrder: (state: Draft<OrderState>, action: PayloadAction<Order>) => {
            state.order = action.payload;
        },
        sendOrderStarted: (state) => {
            state.orderFailed = false;
            state.orderSending = true;
        },
        sendOrderFailed: (state) => {
            state.orderFailed = true;
            state.orderSending = false;
        },
        sendOrderSuccess: (state) => {
            state.orderFailed = false;
            state.orderSending = false;
        },
    },
})

export const {
    clearOrder,
    setOrder,
    sendOrderStarted,
    sendOrderSuccess,
    sendOrderFailed
} = orderSlice.actions;


export const clearOrderThunk = createAsyncThunk(
    'order/clearOrder',
    async (_, {dispatch}) => {
        await dispatch(clearOrder())
        await dispatch(clearOrderItems())
        await dispatch(clearIngredientAmount())
    }
)

export const sendOrderThunk = createAsyncThunk(
    'order/sendOrder',
    // Declare the type your function argument here:
    async (_, {dispatch, getState}) => {
        const {cart} = getState() as RootState;
        await dispatch(sendOrderStarted())
        const orderData = [...cart.items.map(orderItem => orderItem.ingredient._id)];
        if (cart.bunItem?.ingredient._id) {
            orderData.push(cart.bunItem?.ingredient._id);
        }
        sendOrder(orderData)
            .then(orderInfo => {
                const newOrder: Order = {id: orderInfo.order.number, name: orderInfo.name};
                dispatch(setOrder(newOrder));
                dispatch(sendOrderSuccess());
            })
            .catch(error => {
                console.log('error', error);
                dispatch(sendOrderFailed());
            })

    }
)
