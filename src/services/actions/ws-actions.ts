import {createAction} from "@reduxjs/toolkit";

export const WS_CONNECTION_START: 'WS_CONNECTION_START' = 'WS_CONNECTION_START';
export const WS_CONNECTION_STOP: 'WS_CONNECTION_STOP' = 'WS_CONNECTION_STOP';

export const wsConnect = createAction<string, typeof WS_CONNECTION_START>(WS_CONNECTION_START)
export const wsDisconnect = createAction(WS_CONNECTION_STOP)
