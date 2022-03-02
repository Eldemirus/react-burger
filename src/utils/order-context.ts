import React from "react";
import {Ingredient} from "../components/common/ingredient";
import {OrderItem} from "../components/common/order-item";
import {v4 as uuid} from "uuid";

export const initialOrderState: OrderState = {
    items: [],
    total: 0
}

export enum OrderActionKind {
    ADD = 'ADD',
    REMOVE = 'REMOVE',
    CLEAR = 'CLEAR',
}

const BUN = 'bun';

export interface OrderAction {
    type: OrderActionKind;
    payload?: Ingredient | string;
}

export interface OrderState {
    items: Array<OrderItem>;
    total: number;
}

function countTotalChange(ingredient: Ingredient) {
    return (ingredient.type === BUN ? 2 : 1) * ingredient.price;
}

export const orderReducerFun = (state: OrderState, action: OrderAction): OrderState => {
    switch (action.type) {
        case OrderActionKind.ADD:
            const items = [...state.items];
            const ingredient = action.payload as Ingredient;
            let totalAdded = state.total;
            if (ingredient.type === BUN) {
                const bun = items.find(element => element.ingredient.type === BUN);
                if (bun) {
                    items.splice(items.indexOf(bun), 1);
                    totalAdded -= countTotalChange(bun.ingredient);
                }
            }
             totalAdded += countTotalChange(ingredient);
            return  {...state, items: [{id: uuid(), ingredient: ingredient}, ...items], total: totalAdded};
        case OrderActionKind.REMOVE:
            const index = state.items.findIndex(item => item.id === action.payload)
            const ingredientDeleted = state.items[index].ingredient;
            const totalRemoved = state.total - countTotalChange(ingredientDeleted);
            const newItems = [...state.items];
            newItems.splice(index, 1);
            return {...state, items: newItems, total: totalRemoved};
        case OrderActionKind.CLEAR:
            return {...state, items: [], total: 0};
    }
    return state;
}

export interface OrderContextType {
    orderState: OrderState;
    orderDispatch: React.Dispatch<OrderAction>;
}

export const OrderContext = React.createContext<OrderContextType>({
    orderState: initialOrderState,
    orderDispatch: ()=>null
});
