import {Ingredient} from "./ingredient";

export interface OrderItem {
    id: string;
    index?: number;
    ingredient: Ingredient;
}

