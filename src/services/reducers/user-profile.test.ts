import thunk from "redux-thunk";
import createMockStore from "redux-mock-store";
import {AppDispatch} from "../store";
import {authSlice, loginUserThunk, setUser, User} from "./auth";
import {addOrderItem, cartSlice, clearOrderItems, deleteOrderItem, swapOrderItems} from "./cart";
import {
  setSaveUserFailed,
  setSaveUserStarted,
  setSaveUserSuccess,
  updateUserThunk,
  userProfileSlice
} from "./user-profile";
import fetchMock from "fetch-mock";
import {URL} from "../../utils/parameters";

const middlewares = [thunk];
export const mockStore = createMockStore<any, AppDispatch>(middlewares);

const initialState = {
  savingUserFailed: false,
  savingUserStarted: false,
  savingUserSuccess: false
}
const user: User = {email: 'email', name: 'name'};

test('should set started to true and failed to false and success to false', () => {
  let currentState = userProfileSlice.reducer(initialState, setSaveUserStarted());
  expect(currentState.savingUserStarted).toBeTruthy();
  expect(currentState.savingUserSuccess).toBeFalsy();
  expect(currentState.savingUserFailed).toBeFalsy();
})

test('should set failed to true and started to false', () => {
  let currentState = userProfileSlice.reducer(initialState, setSaveUserFailed());
  expect(currentState.savingUserStarted).toBeFalsy();
  expect(currentState.savingUserFailed).toBeTruthy();
})

test('should set success to true and started to false', () => {
  let currentState = userProfileSlice.reducer(initialState, setSaveUserSuccess());
  expect(currentState.savingUserStarted).toBeFalsy();
  expect(currentState.savingUserSuccess).toBeTruthy();
})

describe('async actions', () => {
  afterEach(() => {
    fetchMock.restore()
  })

  it('success save user data', () => {
    const token = 'token'
    fetchMock.patchOnce(`${URL}/auth/user`, {
          body: {user: user, success: true, accessToken: `Bearer ${token}`},
        }
    )
    // Initialize mockstore with empty state
    const formData = {email: 'email', password: 'password', name: 'name'};
    const initialState = {auth: {token: 'token'}};
    const store = mockStore(initialState)
    // Dispatch the action
    return store.dispatch(updateUserThunk(formData)).then(() => {
      // Test if your store dispatched the expected actions
      const actions = store.getActions()
      expect(actions).toContainEqual(userProfileSlice.actions.setSaveUserStarted())
      expect(actions).toContainEqual(authSlice.actions.setUser(user))
      expect(actions).toContainEqual(userProfileSlice.actions.setSaveUserSuccess())
      expect(actions).not.toContainEqual(userProfileSlice.actions.setSaveUserFailed())
    })
  })
  it('failed save user data', () => {
    const token = 'token'
    fetchMock.patchOnce(`${URL}/auth/user`, {
          body: {user: user, success: true, accessToken: `Bearer ${token}`},
        }
    )
    // Initialize mockstore with empty state
    const formData = {email: 'email', password: 'password', name: 'name'};
    const initialState = {auth: {}};
    const store = mockStore(initialState)
    // Dispatch the action
    return store.dispatch(updateUserThunk(formData)).then(() => {
      // Test if your store dispatched the expected actions
      const actions = store.getActions()
      expect(actions).toContainEqual(userProfileSlice.actions.setSaveUserStarted())
      expect(actions).not.toContainEqual(authSlice.actions.setUser(user))
      expect(actions).not.toContainEqual(userProfileSlice.actions.setSaveUserSuccess())
      expect(actions).toContainEqual(userProfileSlice.actions.setSaveUserFailed())
    })
  })
})