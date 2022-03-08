import {createSlice, Draft, PayloadAction} from "@reduxjs/toolkit";
import {OrderItem} from "../../components/common/order-item";
import {Ingredient} from "../../components/common/ingredient";
import {v4 as uuid} from "uuid";
import {Order} from "../../components/common/order";

export interface OrderState {
    items: OrderItem[];
    total: number;
    order?: Order;
}

const BUN = 'bun';

const initialState: OrderState = {
    items: [],
    total: 0,
}

function countTotalChange(ingredient: Ingredient) {
    return (ingredient.type === BUN ? 2 : 1) * ingredient.price;
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addOrderItem: (state: Draft<OrderState>, action: PayloadAction<Ingredient>) => {
            if (action.payload.type === BUN) {
                const bun = state.items.find(element => element.ingredient.type === BUN);
                if (bun) {
                    state.items.splice(state.items.indexOf(bun), 1);
                    state.total -= countTotalChange(bun.ingredient);
                }
            }
            state.total += countTotalChange(action.payload);
            state.items.push({
                id: uuid(),
                ingredient: action.payload
            });
        },
        deleteOrderItem: (state: Draft<OrderState>, action: PayloadAction<OrderItem>) => {
            state.total -= countTotalChange(action.payload.ingredient);
            state.items.splice(state.items.indexOf(action.payload), 1);
        },
        clearOrder: (state) => {
            state.items = [];
            state.total = 0;
            state.order = undefined;
        },
        setOrder: (state: Draft<OrderState>, action: PayloadAction<Order>) => {
            state.order = action.payload;
        }
    },
})

const {actions} = orderSlice;
export const { addOrderItem, deleteOrderItem, clearOrder, setOrder } = actions;