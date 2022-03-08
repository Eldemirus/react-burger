import {combineReducers} from "redux";
import './order';
import {orderSlice} from "./order";
import {ingredientSlice} from "./ingredients";

export const rootReducer = combineReducers({
    order: orderSlice.reducer,
    ingredients: ingredientSlice.reducer,
})