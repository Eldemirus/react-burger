import {Ingredient} from "../../components/common/ingredient";
import {createAsyncThunk, createSlice, Draft, PayloadAction} from "@reduxjs/toolkit";
import {BUN} from "./order";
import {getIngredients} from "../../utils/api";

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
        incIngredientAmount: (state: Draft<IngredientsState>, action: PayloadAction<string>) => {
            const ingredient = state.ingredients.find(ingredient => ingredient._id === action.payload);
            if (ingredient) {
                ingredient.amount = ingredient.amount ? (ingredient.amount + 1) : 1;
            }
        },
        decIngredientAmount: (state: Draft<IngredientsState>, action: PayloadAction<string>) => {
            const ingredient = state.ingredients.find(ingredient => ingredient._id === action.payload);
            if (ingredient) {
                ingredient.amount = (ingredient.amount && ingredient.amount > 0) ? (ingredient.amount - 1) : 0;
            }
        },
        clearIngredientAmount: (state: Draft<IngredientsState>, action: PayloadAction<string|undefined>) => {
            state.ingredients.forEach(ingredient => {
                if (!action.payload|| ingredient.type === BUN){
                    ingredient.amount = 0
                }
            });
        },

    }
})

const {actions} = ingredientSlice;
export const {
    setIngredients,
    setIngredientInfo,
    setIngredientsLoading,
    clearIngredientInfo,
    incIngredientAmount,
    decIngredientAmount,
    clearIngredientAmount
} = actions;

export const loadIngredients = createAsyncThunk(
    'ingredients/loadIngredients',
    // Declare the type your function argument here:
    async (_, {dispatch }) => {
        await dispatch(setIngredientsLoading(true));
        const data = await getIngredients();
        await dispatch(setIngredientsLoading(false));
        await dispatch(setIngredients(data));


    }
)
