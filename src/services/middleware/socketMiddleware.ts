import type {Middleware, MiddlewareAPI} from 'redux';

import type {AppDispatch, RootState} from '../store';
import {ActionCreatorWithoutPayload, ActionCreatorWithPayload, AsyncThunk} from "@reduxjs/toolkit";

export type TWsActionTypes = {
  wsConnect: ActionCreatorWithPayload<string>,
  wsDisconnect: ActionCreatorWithoutPayload,
  wsSendMessage?: ActionCreatorWithPayload<any>,
  wsConnecting?: ActionCreatorWithoutPayload,
  onOpen: ActionCreatorWithoutPayload,
  onClose: ActionCreatorWithoutPayload,
  onError: ActionCreatorWithoutPayload,
  onMessage: ActionCreatorWithPayload<any> | AsyncThunk<void, any, {}>
}



export const socketMiddleware = (wsActions: TWsActionTypes, wsUrl: string): Middleware => {
  return ((store: MiddlewareAPI<AppDispatch, RootState>) => {
    let socket: WebSocket | null = null;

    return next => (action) => {
      const { dispatch } = store;
      const { wsConnect, wsDisconnect, wsSendMessage, onOpen,
        onClose, onError, onMessage, wsConnecting } = wsActions;

      if (wsConnect.match(action)) {
        socket = new WebSocket(wsUrl + action.payload);
        if (wsConnecting) {
          dispatch(wsConnecting());
        }
      }
      if (socket) {

        // функция, которая вызывается при открытии сокета
        socket.onopen = () => {
          dispatch(onOpen());
        };

        // функция, которая вызывается при ошибке соединения
        socket.onerror = error => {
          console.log('socket error', error);
          dispatch(onError());
        };

        // функция, которая вызывается при получения события от сервера
        socket.onmessage = event => {
          const { data } = event;
          const message = JSON.parse(data);
          dispatch(onMessage(message));
        };
        // функция, которая вызывается при закрытии соединения
        socket.onclose = event => {
          if (event.code !== 1000) {
            console.log('error', event);
            dispatch(onError());
          }
          dispatch(onClose());
        };

        if (wsSendMessage && wsSendMessage.match(action))  {
          // функция для отправки сообщения на сервер
          socket.send(JSON.stringify(action.payload));
        }

        if (wsDisconnect.match(action)) {
          socket.close();
          dispatch(onClose());
        }
      }

      next(action);
    };
  }) as Middleware;
};