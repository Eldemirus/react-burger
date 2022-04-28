// socketMiddleware.ts
import type {Middleware, MiddlewareAPI} from 'redux';

import type {AppAction, AppDispatch, RootState} from '../store';
import {
  clearOrderList,
  getOrderListFailed,
  getOrderListStarted,
  getOrderListSuccess,
  setOrderList,
  setTotal,
  setTotalToday
} from "../reducers/order-list";
import {
  WS_CONNECTION_START,
  WS_CONNECTION_STOP,
  WS_SEND_MESSAGE,
  wsConnectClosed,
  wsConnectError,
  wsConnectSuccess
} from "../actions/ws-actions";

export const socketMiddleware = (wsUrl: string): Middleware => {
  return ((store: MiddlewareAPI<AppDispatch, RootState>) => {
    let socket: WebSocket | null = null;

    return next => (action: AppAction) => {
      const { dispatch } = store;
      const { type, payload } = action;

      if (type === WS_CONNECTION_START) {
        socket = new WebSocket(wsUrl + payload);
        dispatch(getOrderListStarted())
      }
      if (socket) {

        // функция, которая вызывается при открытии сокета
        socket.onopen = event => {
          dispatch(wsConnectSuccess(event));
        };

        // функция, которая вызывается при ошибке соединения
        socket.onerror = event => {
          dispatch(wsConnectError(event));
          dispatch(getOrderListFailed());
        };

        // функция, которая вызывается при получения события от сервера
        socket.onmessage = event => {
          const { data } = event;
          const message = JSON.parse(data);
          if (message.success) {
            dispatch(setOrderList(message.orders));
            dispatch(setTotal(message.total));
            dispatch(setTotalToday(message.totalToday));
            dispatch(getOrderListSuccess())
          } else {
            dispatch(clearOrderList());
            dispatch(getOrderListFailed());
          }
        };
        // функция, которая вызывается при закрытии соединения
        socket.onclose = event => {
          dispatch(wsConnectClosed(event));
        };

        if (type === WS_SEND_MESSAGE) {
          const message = payload;
          // функция для отправки сообщения на сервер
          socket.send(JSON.stringify(message));
        }

        if (type === WS_CONNECTION_STOP) {
          socket.close();
        }
      }

      next(action);
    };
  }) as Middleware;
};