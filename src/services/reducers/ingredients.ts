import {Ingredient} from "../../components/common/ingredient";
import {createSlice, Draft, PayloadAction} from "@reduxjs/toolkit";

export interface IngredientsState {
    ingredients: Ingredient[];
    ingredientInfo?: Ingredient;
    ingredientsLoading: boolean;
}

const initialState = {
    ingredients: [],
    ingredientsLoading: false,

}

export const ingredientSlice = createSlice({
    name: 'ingredients',
    initialState,
    reducers: {
        setIngredients: (state: Draft<IngredientsState>, action: PayloadAction<Ingredient[]>) => {
            state.ingredients = action.payload;
        },
        setIngredientsLoading: (state: Draft<IngredientsState>, action: PayloadAction<boolean>) => {
            state.ingredientsLoading = action.payload;
        },
        setIngredientInfo: (state: Draft<IngredientsState>, action: PayloadAction<Ingredient>) => {
            state.ingredientInfo = action.payload;
        },
        clearIngredientInfo: (state: Draft<IngredientsState>) => {
            state.ingredientInfo = undefined;
        },

    }
})

const {actions} = ingredientSlice;
export const { setIngredients, setIngredientInfo, setIngredientsLoading, clearIngredientInfo } = actions;