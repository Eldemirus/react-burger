import {configureStore} from '@reduxjs/toolkit'
import {rootReducer} from './reducers';
import {jwt} from "./middleware/jwt";
import {TypedUseSelectorHook, useDispatch as dispatchHook, useSelector as selectorHook} from 'react-redux';
import {socketMiddleware, TWsActionTypes} from "./middleware/socketMiddleware";
import {WS_URL} from "../utils/parameters";
import {wsConnect, wsDisconnect} from "./actions/ws-actions";
import {getOrderListFailed, getOrderListStarted, onMessage} from "./reducers/order-list";


const wsOrderActions: TWsActionTypes = {
        wsConnect: wsConnect,
        wsDisconnect: wsDisconnect,
        onOpen: getOrderListStarted,
        onClose: getOrderListFailed,
        onError: getOrderListFailed,
        onMessage: onMessage,
}

const wsOrdersMiddleware = socketMiddleware(wsOrderActions, `${WS_URL}`);

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(jwt, wsOrdersMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

export const useDispatch = () => dispatchHook<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store
