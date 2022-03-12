import {combineReducers} from "redux";
import {orderSlice} from "./order";
import {ingredientSlice} from "./ingredients";
import {ingredientInfoSlice} from "./ingredients-info";
import {cartSlice} from "./cart";

export const rootReducer = combineReducers({
    order: orderSlice.reducer,
    cart: cartSlice.reducer,
    ingredients: ingredientSlice.reducer,
    ingredientInfo: ingredientInfoSlice.reducer,
})