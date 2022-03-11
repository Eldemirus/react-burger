import {Ingredient} from "../../components/common/ingredient";
import {createAsyncThunk, createSlice, Draft, PayloadAction} from "@reduxjs/toolkit";
import {getIngredients} from "../../utils/api";
import {BUN} from "./cart";

export interface IngredientsState {
    ingredients: Ingredient[];
    ingredientsLoading: boolean;
    ingredientsFailed: boolean;
}

const initialState: IngredientsState = {
    ingredients: [],
    ingredientsLoading: false,
    ingredientsFailed: false,

}

export const ingredientSlice = createSlice({
    name: 'ingredients',
    initialState,
    reducers: {
        getIngredientsStarted: (state: Draft<IngredientsState>) => {
            state.ingredientsLoading = true;
            state.ingredientsFailed = false;
        },
        getIngredientsFailed: (state: Draft<IngredientsState>) => {
            state.ingredientsLoading = false;
            state.ingredientsFailed = true;
        },
        getIngredientsSuccess: (state: Draft<IngredientsState>) => {
            state.ingredientsLoading = false;
            state.ingredientsFailed = false;
        },
        setIngredients: (state: Draft<IngredientsState>, action: PayloadAction<Ingredient[]>) => {
            state.ingredients = action.payload;
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
    incIngredientAmount,
    decIngredientAmount,
    clearIngredientAmount,
    getIngredientsFailed,
    getIngredientsStarted,
    getIngredientsSuccess
} = actions;

export const loadIngredients = createAsyncThunk(
    'ingredients/loadIngredients',
    // Declare the type your function argument here:
    async (_, {dispatch }) => {
        dispatch(getIngredientsStarted());
        getIngredients().then(data => {
            dispatch(getIngredientsSuccess());
            dispatch(setIngredients(data));
        }).catch(error => {
            console.log('error', error);
            dispatch(getIngredientsFailed());
        })
    }
)
