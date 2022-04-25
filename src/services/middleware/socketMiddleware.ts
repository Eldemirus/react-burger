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

export const socketMiddleware = (wsUrl: string): Middleware => {
  return ((store: MiddlewareAPI<AppDispatch, RootState>) => {
    let socket: WebSocket | null = null;

    return next => (action: AppAction) => {
      const { dispatch, getState } = store;
      const { type, payload } = action;

      if (type === 'WS_CONNECTION_START') {
        socket = new WebSocket(wsUrl + payload);
        dispatch(getOrderListStarted())
      }
      if (socket) {

        // функция, которая вызывается при открытии сокета
        socket.onopen = event => {
          dispatch({ type: 'WS_CONNECTION_SUCCESS', payload: event });
        };

        // функция, которая вызывается при ошибке соединения
        socket.onerror = event => {
          dispatch({ type: 'WS_CONNECTION_ERROR', payload: event });
          dispatch(getOrderListFailed());
        };

        // функция, которая вызывается при получения события от сервера
        socket.onmessage = event => {
          const { data } = event;
          const message = JSON.parse(data);

          if (message.success) {
            dispatch(getOrderListSuccess())
            dispatch(setOrderList(message.orders));
            dispatch(setTotal(message.total));
            dispatch(setTotalToday(message.totalToday));
          } else {
            dispatch(getOrderListFailed());
            dispatch(clearOrderList());
          }
        };
        // функция, которая вызывается при закрытии соединения
        socket.onclose = event => {
          dispatch({ type: 'WS_CONNECTION_CLOSED', payload: event });
        };

        if (type === 'WS_SEND_MESSAGE') {
          const message = payload;
          // функция для отправки сообщения на сервер
          socket.send(JSON.stringify(message));
        }

        if (type === 'WS_CONNECTION_STOP') {
          socket.close();
        }
      }

      next(action);
    };
  }) as Middleware;
};