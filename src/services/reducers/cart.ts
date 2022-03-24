import {createAsyncThunk, createSlice, Draft, PayloadAction} from "@reduxjs/toolkit";
import {OrderItem} from "../../pages/common/order-item";
import {Ingredient} from "../../pages/common/ingredient";
import {v4 as uuid} from "uuid";
import {clearIngredientAmount, decIngredientAmount, incIngredientAmount} from "./ingredients";

export interface CartState {
    items: OrderItem[];
    bunItem?: OrderItem;
}

export const BUN = 'bun';

const initialState: CartState = {
    items: [],
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addOrderItem: (state: Draft<CartState>, action: PayloadAction<{ingredient: Ingredient, id: string}>) => {
            const item = {
                id: action.payload.id,
                ingredient: action.payload.ingredient
            };
            if (action.payload.ingredient.type === BUN) {
                state.bunItem = item;
            } else {
                state.items.push(item);
            }
        },
        deleteOrderItem: (state: Draft<CartState>, action: PayloadAction<OrderItem>) => {
            const index = state.items.findIndex(item => action.payload.id === item.id);
            state.items.splice(index, 1);
        },
        swapOrderItems: (state: Draft<CartState>, action: PayloadAction<{ from: number, to: number }>) => {
            state.items[action.payload.to].index = action.payload.from;
            state.items.splice(action.payload.to, 0, state.items.splice(action.payload.from, 1)[0]);
        },
        clearOrderItems: (state) => {
            state.items = [];
            state.bunItem = undefined;
        },
    },
})

export const {
    addOrderItem,
    deleteOrderItem,
    clearOrderItems,
    swapOrderItems,
} = cartSlice.actions;

export const addItem = createAsyncThunk(
    'order/addItem',
    // Declare the type your function argument here:
    async (ingredient: Ingredient, {dispatch,}) => {
        if (ingredient.type === BUN) {
            await dispatch(clearIngredientAmount(BUN))
        }
        await dispatch(addOrderItem({ingredient, id: uuid()}))
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
