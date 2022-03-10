import {createAsyncThunk, createSlice, Draft, PayloadAction} from "@reduxjs/toolkit";
import {OrderItem} from "../../components/common/order-item";
import {Ingredient} from "../../components/common/ingredient";
import {v4 as uuid} from "uuid";
import {Order} from "../../components/common/order";
import {clearIngredientAmount, decIngredientAmount, incIngredientAmount} from "./ingredients";
import {sendOrder} from "../../utils/api";
import {RootState} from "../store";

export interface OrderState {
    items: OrderItem[];
    bunItem?: OrderItem;
    order?: Order;
}

export const BUN = 'bun';

const initialState: OrderState = {
    items: [],
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addOrderItem: (state: Draft<OrderState>, action: PayloadAction<Ingredient>) => {
            const item = {
                id: uuid(),
                ingredient: action.payload
            };
            if (action.payload.type === BUN) {
                state.bunItem = item;
            } else {
                state.items.push(item);
            }
        },
        deleteOrderItem: (state: Draft<OrderState>, action: PayloadAction<OrderItem>) => {
            const index = state.items.findIndex(item => action.payload.id === item.id);
            state.items.splice(index, 1);
        },
        swapOrderItems:(state: Draft<OrderState>, action: PayloadAction<{from:number, to:number}>) => {
            state.items[action.payload.to].index = action.payload.from;
            state.items.splice(action.payload.to, 0, state.items.splice(action.payload.from, 1)[0]);
        },
        clearOrder: (state) => {
            state.items = [];
            state.bunItem = undefined;
            state.order = undefined;
        },
        setOrder: (state: Draft<OrderState>, action: PayloadAction<Order>) => {
            state.order = action.payload;
        }
    },
})

export const { addOrderItem, deleteOrderItem, clearOrder, setOrder, swapOrderItems } = orderSlice.actions;

export const addItem = createAsyncThunk(
    'order/addItem',
    // Declare the type your function argument here:
    async (ingredient: Ingredient, {dispatch, }) => {
        if (ingredient.type === BUN) {
            await dispatch(clearIngredientAmount(BUN))
        }
        await dispatch(addOrderItem(ingredient))
        await dispatch(incIngredientAmount(ingredient._id))
    }
)

export const deleteItem = createAsyncThunk(
    'order/delItem',
    // Declare the type your function argument here:
    async (item: OrderItem, {dispatch}) => {
        await dispatch(decIngredientAmount(item.ingredient._id))
        await dispatch(deleteOrderItem(item))
    }
)


export const clearOrderThunk = createAsyncThunk(
    'order/clearOrder',
    async (_, {dispatch}) => {
        await dispatch(clearOrder())
        await dispatch(clearIngredientAmount())
    }
)

export const sendOrderThunk = createAsyncThunk(
    'order/sendOrder',
    // Declare the type your function argument here:
    async (_, {dispatch, getState }) => {
        const { order } =  getState() as RootState;
        const orderData = order.items.map(orderItem => orderItem.ingredient._id);

        const orderInfo = await sendOrder(orderData);
        const newOrder: Order = {id: orderInfo.order.number, name: orderInfo.name};
        dispatch(setOrder(newOrder));
    }
)
