import jwtDecode from "jwt-decode";
import {RootState} from "../store";
import moment from "moment";
import {saveTokenCookie, setToken, startFetchToken, stopFetchToken, TOKEN_COOKIE_NAME} from "../reducers/auth";
import {AnyAction, Middleware} from "redux";
import {getCookie} from "../../utils/cookies";
import {getAccessToken} from "../../utils/api-user";
import {Dispatch} from "react";

export const logger: Middleware<{}, RootState> = store => next => action => {
    console.group(action.type)
    console.info('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    console.groupEnd()
    return result
}


export async function refreshToken(dispatch: Dispatch<AnyAction>) {
    const refresh = getCookie(TOKEN_COOKIE_NAME);
    if (!refresh) {
        return Promise.reject('no refresh');
    }

    const freshTokenPromise = getAccessToken(refresh)
        .then(result => {
            if (result.refreshToken) {
                saveTokenCookie(result.refreshToken);
            }
            if (result.accessToken) {
                const newToken = result.accessToken.split('Bearer ')[1];
                if (newToken) {
                    dispatch(stopFetchToken())
                    dispatch(setToken(newToken));
                    return Promise.resolve(newToken)
                }
            }

            dispatch(stopFetchToken());

            return Promise.reject({
                message: 'could not refresh token'
            });
        })
        .catch(e => {
            dispatch(stopFetchToken())
            return Promise.reject(e);
        });

    dispatch(startFetchToken(freshTokenPromise));
    return freshTokenPromise;
}
export const jwt: Middleware<{}, RootState> = store => next => async action => {
    // only worry about expiring token for async actions
    if (action.type.match(/user\/updateUser/)) {
        const token: string = store.getState().auth?.token ?? '';
        if (token) {
            // decode jwt so that we know if and when it expires
            const tokenObject: any = jwtDecode(token);
            const tokenExpiration = tokenObject.exp;

            if (tokenExpiration && (moment(tokenExpiration * 1000).diff(moment(Date.now())) < 5000000)) {
                const refreshPromise = store.getState().auth.freshTokenPromise;
                if (refreshPromise !== undefined) {
                    return refreshPromise.then(() => next(action));
                } else {
                    return refreshToken(store.dispatch).then(() => next(action));
                }
            }

        }
    }
    return next(action);
}