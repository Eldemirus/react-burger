import {createAction} from "@reduxjs/toolkit";

export const WS_CONNECTION_START: 'WS_CONNECTION_START' = 'WS_CONNECTION_START';
export const WS_CONNECTION_SUCCESS: 'WS_CONNECTION_SUCCESS' = 'WS_CONNECTION_SUCCESS';
export const WS_CONNECTION_ERROR: 'WS_CONNECTION_ERROR' = 'WS_CONNECTION_ERROR';
export const WS_CONNECTION_CLOSED: 'WS_CONNECTION_CLOSED' = 'WS_CONNECTION_CLOSED';
export const WS_SEND_MESSAGE: 'WS_SEND_MESSAGE' = 'WS_SEND_MESSAGE';
export const WS_CONNECTION_STOP: 'WS_CONNECTION_STOP' = 'WS_CONNECTION_STOP';

export type WsActions =
    'WS_CONNECTION_START'
    | 'WS_CONNECTION_SUCCESS'
    | 'WS_CONNECTION_ERROR'
    | 'WS_CONNECTION_CLOSED'
    | 'WS_SEND_MESSAGE'
    | 'WS_CONNECTION_STOP';

export const wsConnect = createAction<string, typeof WS_CONNECTION_START>(WS_CONNECTION_START)
export const wsDisconnect = createAction(WS_CONNECTION_STOP)
export const wsConnectSuccess = createAction<Event, typeof WS_CONNECTION_SUCCESS>(WS_CONNECTION_SUCCESS)
export const wsConnectError = createAction<Event, typeof WS_CONNECTION_ERROR>(WS_CONNECTION_ERROR)
export const wsConnectClosed = createAction<Event, typeof WS_CONNECTION_CLOSED>(WS_CONNECTION_CLOSED)
export const wsSendMessage = createAction<any, typeof WS_SEND_MESSAGE>(WS_SEND_MESSAGE)