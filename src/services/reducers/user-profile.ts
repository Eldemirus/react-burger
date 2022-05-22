import {createAsyncThunk, createSlice, Draft} from "@reduxjs/toolkit";
import {saveUserInfo} from "../../utils/api-user";
import {RootState} from "../store";
import {setUser} from "./auth";


export const TOKEN_COOKIE_NAME = 'refresh-token';

export interface UserProfileState {
    savingUserStarted: boolean;
    savingUserFailed: boolean;
    savingUserSuccess: boolean;
}

const initialState: UserProfileState = {
    savingUserFailed: false,
    savingUserStarted: false,
    savingUserSuccess: false
}

export const userProfileSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setSaveUserStarted: (state: Draft<UserProfileState>) => {
            state.savingUserStarted = true;
            state.savingUserFailed = false;
            state.savingUserSuccess = false;
        },
        setSaveUserFailed: (state: Draft<UserProfileState>) => {
            state.savingUserStarted = false;
            state.savingUserFailed = true;
        },
        setSaveUserSuccess: (state: Draft<UserProfileState>) => {
            state.savingUserStarted = false;
            state.savingUserSuccess = true;
        },
    },
})

export const {
    setSaveUserStarted,
    setSaveUserSuccess,
    setSaveUserFailed
} = userProfileSlice.actions;


export const updateUserThunk = createAsyncThunk(
    'user/updateUser',
    // Declare the type your function argument here:
    async ({email, name, password}: {email: string, name: string, password: string}, {dispatch, getState}) => {
        const {auth} = getState() as RootState;
        dispatch(setSaveUserStarted());
        if (!auth.token) {
            dispatch(setSaveUserFailed());
            return
        }
        return saveUserInfo({email, name, password}, auth.token)
            .then(result => {
                dispatch(setUser(result.user));
                dispatch(setSaveUserSuccess());
            })
            .catch(error => {
                console.log('error update user', error);
                // if (error.message === 'jwt expired') {
                //     dispatch(updateTokenThunk())
                // }
                dispatch(setSaveUserFailed());
            })

    }
)
