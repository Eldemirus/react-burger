import thunk from "redux-thunk";
import createMockStore from "redux-mock-store";
import {AppDispatch} from "../store";
import {authSlice, User} from "./auth";
import {
  codeSendFailed,
  codeSendStart,
  codeSendSuccess,
  passwordEmailThunk, passwordSaveThunk,
  restorePasswordSlice,
  setEmail,
  setSavePasswordFailed,
  setSavePasswordStart,
  setSavePasswordSuccess
} from "./restore-password";
import fetchMock from "fetch-mock";
import {URL} from "../../utils/parameters";
import {userProfileSlice} from "./user-profile";

const middlewares = [thunk];
export const mockStore = createMockStore<any, AppDispatch>(middlewares);

const initialState = {
  codeSentSuccess: false,
  codeSentFailed: false,
  codeSentStarted: false,
  passwordSaveStarted: false,
  passwordSaveFailed: false,
  passwordSaveSuccess: false,
}
const user: User = {email: 'email', name: 'name'};

test('should set email', () => {
  let currentState = restorePasswordSlice.reducer(initialState, setEmail(user.email));
  expect(currentState.email).toEqual(user.email);
})


test('should set codeSentStarted', () => {
  let currentState = restorePasswordSlice.reducer(initialState, codeSendStart());
  expect(currentState.codeSentStarted).toBeTruthy();
  expect(currentState.codeSentFailed).toBeFalsy();
  expect(currentState.codeSentSuccess).toBeFalsy();
})

test('should set codeSentFailed', () => {
  let currentState = restorePasswordSlice.reducer(initialState, codeSendFailed());
  expect(currentState.codeSentStarted).toBeFalsy();
  expect(currentState.codeSentFailed).toBeTruthy();
  expect(currentState.codeSentSuccess).toBeFalsy();
})

test('should set codeSentSuccess', () => {
  let currentState = restorePasswordSlice.reducer(initialState, codeSendSuccess());
  expect(currentState.codeSentStarted).toBeFalsy();
  expect(currentState.codeSentFailed).toBeFalsy();
  expect(currentState.codeSentSuccess).toBeTruthy();
})

test('should set passwordSaveStarted', () => {
  let currentState = restorePasswordSlice.reducer(initialState, setSavePasswordStart());
  expect(currentState.passwordSaveStarted).toBeTruthy();
  expect(currentState.passwordSaveFailed).toBeFalsy();
  expect(currentState.passwordSaveSuccess).toBeFalsy();
})

test('should set passwordSaveFailed', () => {
  let currentState = restorePasswordSlice.reducer(initialState, setSavePasswordFailed());
  expect(currentState.passwordSaveStarted).toBeFalsy();
  expect(currentState.passwordSaveFailed).toBeTruthy();
  expect(currentState.passwordSaveSuccess).toBeFalsy();
})

test('should set passwordSaveSuccess', () => {
  let currentState = restorePasswordSlice.reducer(initialState, setSavePasswordSuccess());
  expect(currentState.passwordSaveStarted).toBeFalsy();
  expect(currentState.passwordSaveFailed).toBeFalsy();
  expect(currentState.passwordSaveSuccess).toBeTruthy();
})

describe('async actions', () => {
  afterEach(() => {
    fetchMock.restore()
  })

  it('success send password reset code', () => {
    const token = 'token'
    fetchMock.postOnce(`${URL}/password-reset`, {
          body: {user: user, success: true, accessToken: `Bearer ${token}`},
        }
    )
    // Initialize mockstore with empty state
    const formData = {email: 'email'};
    const initialState = {auth: {token: 'token'}};
    const store = mockStore(initialState)
    // Dispatch the action
    return store.dispatch(passwordEmailThunk(formData)).then(() => {
      // Test if your store dispatched the expected actions
      const actions = store.getActions()
      expect(actions).toContainEqual(restorePasswordSlice.actions.codeSendStart())
      expect(actions).toContainEqual(restorePasswordSlice.actions.setEmail(formData.email))
      expect(actions).toContainEqual(restorePasswordSlice.actions.codeSendSuccess())
    })
  })

  it('success reset password', () => {
    fetchMock.postOnce(`${URL}/password-reset/reset`, {
          body: {user: user, success: true},
        }
    )
    // Initialize mockstore with empty state
    const formData = {password: 'password', code: 'code'};
    const initialState = {};
    const store = mockStore(initialState)
    // Dispatch the action
    return store.dispatch(passwordSaveThunk(formData)).then(() => {
      // Test if your store dispatched the expected actions
      const actions = store.getActions()
      expect(actions).toContainEqual(restorePasswordSlice.actions.setSavePasswordStart())
      expect(actions).toContainEqual(restorePasswordSlice.actions.setSavePasswordSuccess())
    })
  })
})


