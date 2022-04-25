import {configureStore} from '@reduxjs/toolkit'
import {rootReducer} from './reducers';
import {jwt} from "./middleware/jwt";
import {TypedUseSelectorHook, useDispatch as dispatchHook, useSelector as selectorHook} from 'react-redux';
import {socketMiddleware} from "./middleware/socketMiddleware";
import {WS_URL} from "../utils/parameters";

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(jwt, socketMiddleware(`${WS_URL}`)),
    devTools: process.env.NODE_ENV !== 'production',
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
export type AppAction = {
    type: string;
    payload: any;
}

export const useDispatch = () => dispatchHook<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store
