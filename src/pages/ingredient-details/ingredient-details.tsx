import React from "react";
import styles from "./ingredient-details.module.css";
import {useSelector} from "react-redux";
import {RootState} from "../../services/store";
import {IngredientsState} from "../../services/reducers/ingredients";
import {useLocation, useMatch} from "react-router-dom";
import {PageNotFound} from "../page-not-found/page-not-found";

interface IngredientInfoProps {
    title: string;
    amount: number;
}

const IngredientInfo: React.FC<IngredientInfoProps> = ({title, amount}) => {
    return (
        <div className={styles.infoLineItem}>
            <span className={'text text_color_inactive text_type_main-default'}>{title}</span>
            <span className={'text text_color_inactive text_type_digits-default'}>{amount}</span>
        </div>
    )
}


const IngredientDetails: React.FC = () => {
    const {ingredients} = useSelector<RootState, IngredientsState>(state => state.ingredients);
    const match = useMatch('/ingredient/:id');
    const location = useLocation();
    const state = location.state as {background: Location}


    let ingredient;
    if (match) {
        ingredient = ingredients.find(ingredient => ingredient._id === match.params.id);
    }

    if (!ingredient) {
        return <PageNotFound />;
    }

    return (
        <div className={styles.container}>
            {!state?.background &&
                <div className={'text text_type_main-large'}>Детали ингредиента</div>
            }

            <img src={ingredient.image_large} alt={ingredient.name} />
            <div className={styles.ingredientTitle}>{ingredient.name}</div>
            <div className={styles.infoLine}>
                <IngredientInfo title={'Калории,ккал'} amount={ingredient.calories}/>
                <IngredientInfo title={'Белки, г'} amount={ingredient.proteins}/>
                <IngredientInfo title={'Жиры, г'} amount={ingredient.fat}/>
                <IngredientInfo title={'Углеводы, г'} amount={ingredient.carbohydrates}/>
            </div>
        </div>
    )
}

export default IngredientDetails;