import {Ingredient} from "../../components/common/ingredient";
import {createSlice, Draft, PayloadAction} from "@reduxjs/toolkit";

export interface IngredientInfoState {
    ingredientInfo?: Ingredient;
}

const initialState: IngredientInfoState = {
}

export const ingredientInfoSlice = createSlice({
    name: 'ingredient-info',
    initialState,
    reducers: {
        setIngredientInfo: (state: Draft<IngredientInfoState>, action: PayloadAction<Ingredient>) => {
            state.ingredientInfo = action.payload;
        },
        clearIngredientInfo: (state: Draft<IngredientInfoState>) => {
            state.ingredientInfo = undefined;
        },

    }
})

const {actions} = ingredientInfoSlice;
export const {
    setIngredientInfo,
    clearIngredientInfo,
} = actions;
