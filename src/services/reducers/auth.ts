import {createAsyncThunk, createSlice, Draft, PayloadAction} from "@reduxjs/toolkit";
import {getAccessToken, getUserInfo, loginUser, logoutUser} from "../../utils/api-user";
import {deleteCookie, getCookie, setCookie} from "../../utils/cookies";
import {RootState} from "../store";


export const TOKEN_COOKIE_NAME = 'refresh-token';

export interface User {
    email: string;
    name: string;
    password?: string;
}

export interface AuthState {
    user?: User;
    token?: string;
    checkingUser: boolean;
    freshTokenPromise?: Promise<any>;
    loginStarted: boolean;
    loginFailed: boolean;
    loginSuccess: boolean;
}

const initialState: AuthState = {
    checkingUser: false,
    loginFailed: false,
    loginStarted: false,
    loginSuccess: false
}

export const saveTokenCookie = (token: string) => {
    setCookie(TOKEN_COOKIE_NAME, token, {path: '/'});
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state: Draft<AuthState>, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        setToken: (state: Draft<AuthState>, action: PayloadAction<string>) => {
            if (action.payload) {
                state.token = action.payload;
            }
        },
        clearUser: (state: Draft<AuthState>) => {
            state.user = undefined;
        },
        clearToken: (state: Draft<AuthState>) => {
            state.token = undefined;
            state.loginSuccess = false;
        },
        startChecking: (state: Draft<AuthState>) => {
            state.checkingUser = true;
        },
        stopChecking: (state: Draft<AuthState>) => {
            state.checkingUser = false;
        },
        setLoginStarted: (state: Draft<AuthState>) => {
            state.loginStarted = true;
            state.loginFailed = false;
            state.loginSuccess = false;
        },
        setLoginFailed: (state: Draft<AuthState>) => {
            state.loginStarted = false;
            state.loginFailed = true;
        },
        setLoginSuccess: (state: Draft<AuthState>) => {
            state.loginStarted = false;
            state.loginSuccess = true;
        },
        startFetchToken: (state: Draft<AuthState>, action: PayloadAction<Promise<any>>) => {
            state.freshTokenPromise = action.payload;
        },
        stopFetchToken: (state: Draft<AuthState>) => {
            state.freshTokenPromise = undefined;
        },
    },
})

export const {
    setUser,
    setToken,
    clearUser,
    clearToken,
    startChecking,
    stopChecking,
    setLoginStarted,
    setLoginSuccess,
    setLoginFailed,
    startFetchToken,
    stopFetchToken
} = authSlice.actions;

export const loginUserThunk = createAsyncThunk(
    'auth/login',
    // Declare the type your function argument here:
    async ({email, password}: { email: string, password: string }, {dispatch,}) => {
        dispatch(setLoginStarted())
        loginUser(email, password)
            .then(result => {
                dispatch(setUser(result.user));
                const clearToken = result.accessToken.split('Bearer ')[1];
                dispatch(setToken(clearToken));
                dispatch(setLoginSuccess());
                if (result.refreshToken) {
                    saveTokenCookie(result.refreshToken);
                }
            })
            .catch(error => {
                console.log('error login', error);
                dispatch(setLoginFailed());
            })

    }
)
export const logoutUserThunk = createAsyncThunk(
    'auth/logout',
    // Declare the type your function argument here:
    async (_, {dispatch}) => {
        const refreshToken = getCookie(TOKEN_COOKIE_NAME);
        if (!refreshToken) {
            dispatch(clearUser());
            dispatch(clearToken());
            return;
        }

        logoutUser(refreshToken)
            .then(_ => {
                dispatch(clearUser());
                dispatch(clearToken());
                deleteCookie(TOKEN_COOKIE_NAME);
            })
            .catch(error => {
                console.log('error login', error);
            })

    }
)

export const getUserThunk = createAsyncThunk(
    'auth/getUser',
    // Declare the type your function argument here:
    async (_, {dispatch, getState}) => {
        const {auth} = getState() as RootState;
        dispatch(startChecking())
        let token = auth.token;
        if (!token) {
            try {
                const refresh = getCookie(TOKEN_COOKIE_NAME);
                if (refresh) {
                    const result = await getAccessToken(refresh);
                    if (result.accessToken) {
                        token = result.accessToken.split('Bearer ')[1];
                        if (token) {
                            dispatch(setToken(token))
                        }
                    }
                    if (result.refreshToken) {
                        saveTokenCookie(result.refreshToken);
                    }
                } else {
                    deleteCookie(TOKEN_COOKIE_NAME);
                }
            } catch (e) {
                console.log('ERROR', e)
                deleteCookie(TOKEN_COOKIE_NAME);
            }
        }
        if (!token) {
            dispatch(stopChecking())
            return;
        }
        getUserInfo(token)
            .then(result => {
                dispatch(setUser(result.user));
                if (result.accessToken) {
                    dispatch(setToken(result.accessToken));
                }
                if (result.refreshToken) {
                    saveTokenCookie(result.refreshToken);
                }
            })
            .catch(error => {
                console.log('error login', error);
            })
            .finally(() => {
                dispatch(stopChecking())
            })

    }
)


export const updateTokenThunk = createAsyncThunk(
    'auth/getToken',
    // Declare the type your function argument here:
    async (_, {dispatch}) => {
        dispatch(startChecking())
        let token;
        try {
            const refresh = getCookie(TOKEN_COOKIE_NAME);
            if (refresh) {
                const result = await getAccessToken(refresh);
                if (result.accessToken) {
                    token = result.accessToken.split('Bearer ')[1];
                    if (token) {
                        dispatch(setToken(token))
                    }
                }
                if (result.refreshToken) {
                    saveTokenCookie(result.refreshToken);
                }
            }
        } catch (e) {
            console.log('ERROR', e)
            deleteCookie(TOKEN_COOKIE_NAME);
        }
    }
)

