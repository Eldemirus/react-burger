import thunk from "redux-thunk";
import createMockStore from "redux-mock-store";
import {AppDispatch} from "../store";
import {
  authSlice,
  clearToken,
  clearUser,
  loginUserThunk,
  setLoginFailed,
  setLoginStarted,
  setLoginSuccess,
  setToken,
  setUser,
  startChecking,
  startFetchToken,
  stopChecking,
  stopFetchToken,
  User
} from "./auth";
import fetchMock from 'fetch-mock'
import {URL} from "../../utils/parameters";

const middlewares = [thunk];
export const mockStore = createMockStore<any, AppDispatch>(middlewares);

const initialState = {
  checkingUser: false,
  loginFailed: false,
  loginStarted: false,
  loginSuccess: false
}
const user: User = {email: 'email', name: 'name'};

test('should set user', () => {
  let currentState = authSlice.reducer(initialState, setUser(user));
  expect(currentState.user).toEqual(user);
})

test('should clear user', () => {
  const previousState = {...initialState, user};
  let currentState = authSlice.reducer(previousState, clearUser());
  expect(currentState.user).toBeUndefined();
})

test('should set token', () => {
  const token = 'token-token';
  let currentState = authSlice.reducer(initialState, setToken(token));
  expect(currentState.token).toEqual(token);
})

test('should clear token and loginSuccess', () => {
  const token = 'token-token';
  const previousState = {...initialState, token, loginSuccess: true};
  let currentState = authSlice.reducer(previousState, clearToken());
  expect(currentState.token).toBeUndefined();
  expect(currentState.loginSuccess).toBeFalsy();
})

test('should set checkingUser', () => {
  let currentState = authSlice.reducer(initialState, startChecking());
  expect(currentState.checkingUser).toBeTruthy();
})

test('should unset checkingUser', () => {
  let currentState = authSlice.reducer(initialState, stopChecking());
  expect(currentState.checkingUser).toBeFalsy();
})

test('should set loginStarted loginFailed loginSuccess', () => {
  let currentState = authSlice.reducer(initialState, setLoginStarted());
  expect(currentState.loginStarted).toBeTruthy();
  expect(currentState.loginFailed).toBeFalsy();
  expect(currentState.loginSuccess).toBeFalsy();
})

test('should unset loginStarted and set loginFailed', () => {
  let currentState = authSlice.reducer(initialState, setLoginFailed());
  expect(currentState.loginStarted).toBeFalsy();
  expect(currentState.loginFailed).toBeTruthy();
})

test('should unset loginStarted and set loginSuccess', () => {
  let currentState = authSlice.reducer(initialState, setLoginSuccess());
  expect(currentState.loginStarted).toBeFalsy();
  expect(currentState.loginSuccess).toBeTruthy();
})

test('should set freshTokenPromise', () => {
  let promise = new Promise((resolve, reject) => {
  });
  let currentState = authSlice.reducer(initialState, startFetchToken(promise));
  expect(currentState.freshTokenPromise).toEqual(promise);
})

test('should unset freshTokenPromise', () => {
  let currentState = authSlice.reducer(initialState, stopFetchToken());
  expect(currentState.freshTokenPromise).toBeUndefined();
})


describe('async actions', () => {
  afterEach(() => {
    fetchMock.restore()
  })

  it('success login and save token and set user', () => {
    const token = 'token'
    fetchMock.postOnce(`${URL}/auth/login`, {
          body: {user: user, success: true, accessToken: `Bearer ${token}`},
        }
    )
    // Initialize mockstore with empty state
    const initialState = {}
    const store = mockStore(initialState)
    // Dispatch the action
    return store.dispatch(loginUserThunk({email: 'email', password: 'password'})).then(() => {
      // Test if your store dispatched the expected actions
      const actions = store.getActions()
      expect(actions).toContainEqual(authSlice.actions.setLoginStarted())
      expect(actions).toContainEqual(authSlice.actions.setLoginSuccess())
      expect(actions).not.toContainEqual(authSlice.actions.setLoginFailed())
      expect(actions).toContainEqual(authSlice.actions.setToken(token))
      expect(actions).toContainEqual(authSlice.actions.setUser(user))
    })
  })
  it('failed login', () => {
    const token = 'token'
    fetchMock.postOnce(`${URL}/auth/login`, {
      body: {success: false},
    })
    const initialState = {}
    const store = mockStore(initialState)
    return store.dispatch(loginUserThunk({email: 'email', password: 'password'})).then(() => {
      const actions = store.getActions()
      expect(actions).toContainEqual(authSlice.actions.setLoginStarted())
      expect(actions).not.toContainEqual(authSlice.actions.setLoginSuccess())
      expect(actions).toContainEqual(authSlice.actions.setLoginFailed())
      expect(actions).not.toContainEqual(authSlice.actions.setToken(token))
      expect(actions).not.toContainEqual(authSlice.actions.setUser(user))
    })
  })
})