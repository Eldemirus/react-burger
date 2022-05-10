import {combineReducers} from "redux";
import {orderSlice} from "./order";
import {ingredientSlice} from "./ingredients";
import {cartSlice} from "./cart";
import {authSlice} from "./auth";
import {restorePasswordSlice} from "./restore-password";
import {userProfileSlice} from "./user-profile";
import {orderListSlice} from "./order-list";

export const rootReducer = combineReducers({
    order: orderSlice.reducer,
    orderList: orderListSlice.reducer,
    cart: cartSlice.reducer,
    ingredients: ingredientSlice.reducer,
    auth: authSlice.reducer,
    restorePassword: restorePasswordSlice.reducer,
    userProfile: userProfileSlice.reducer,
})