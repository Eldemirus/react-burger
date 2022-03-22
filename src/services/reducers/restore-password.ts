import {createAsyncThunk, createSlice, Draft, PayloadAction} from "@reduxjs/toolkit";
import {passwordReset, passwordResetConfirmation} from "../../utils/api-user";


export interface RestorePasswordState {
    email?: string;
    codeSentSuccess: boolean;
    codeSentFailed: boolean;
    codeSentStarted: boolean;
    passwordSaveStarted: boolean;
    passwordSaveFailed: boolean;
    passwordSaveSuccess: boolean;
}

const initialState: RestorePasswordState = {
    codeSentSuccess: false,
    codeSentFailed: false,
    codeSentStarted: false,
    passwordSaveStarted: false,
    passwordSaveFailed: false,
    passwordSaveSuccess: false,
}


export const restorePasswordSlice = createSlice({
    name: 'restore-password',
    initialState,
    reducers: {
        setEmail: (state: Draft<RestorePasswordState>, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        codeSendStart: (state: Draft<RestorePasswordState>) => {
            state.codeSentStarted = true;
            state.codeSentFailed = false;
            state.codeSentSuccess = false;
        },
        codeSendFailed: (state: Draft<RestorePasswordState>) => {
            state.codeSentStarted = false;
            state.codeSentFailed = true;
        },
        codeSendSuccess: (state: Draft<RestorePasswordState>) => {
            state.codeSentStarted = false;
            state.codeSentSuccess = true;
        },
        setSavePasswordStart: (state: Draft<RestorePasswordState>) => {
            state.passwordSaveStarted = true;
            state.passwordSaveFailed = false;
            state.passwordSaveSuccess = false;
        },
        setSavePasswordFailed: (state: Draft<RestorePasswordState>) => {
            state.passwordSaveStarted = false;
            state.passwordSaveFailed = true;
        },
        setSavePasswordSuccess: (state: Draft<RestorePasswordState>) => {
            state.passwordSaveStarted = false;
            state.passwordSaveSuccess = true;
        },
    },
})

export const {
    setEmail,
    codeSendStart,
    codeSendFailed,
    codeSendSuccess,
    setSavePasswordStart,
    setSavePasswordFailed,
    setSavePasswordSuccess
} = restorePasswordSlice.actions;

export const passwordEmailThunk = createAsyncThunk(
    'auth/password-forget',
    // Declare the type your function argument here:
    async ({email}: { email: string }, {dispatch,}) => {
        dispatch(codeSendStart());
        passwordReset(email)
            .then(_ => {
                dispatch(setEmail(email));
                dispatch(codeSendSuccess());
            })
            .catch(error => {
                dispatch(codeSendFailed());
                console.log('code send error', error);
            })

    }
)

export const passwordSaveThunk = createAsyncThunk(
    'auth/password-reset',
    // Declare the type your function argument here:
    async ({code, password}: { password: string, code: string }, {dispatch,}) => {
        dispatch(setSavePasswordStart());
        passwordResetConfirmation(password, code)
            .then(result => {
                console.log('SAVE PASSWORD', result)
                dispatch(setSavePasswordSuccess());
            })
            .catch(error => {
                dispatch(setSavePasswordFailed());
                console.log('password save error', error);
            })

    }
)

