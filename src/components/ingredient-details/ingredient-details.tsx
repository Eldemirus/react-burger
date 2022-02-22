import React from "react";
import {Ingredient} from "../common/ingredient";
import styles from "./ingredient-details.module.css";
import Modal from "../modal/modal";


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

interface IngredientDetailsProps {
    ingredient: Ingredient;
    handleClose: () => void;
}

const IngredientDetails: React.FC<IngredientDetailsProps> = ({ingredient, handleClose}) => {

    return (
        <Modal handleClose={handleClose} title={'Детали ингредиента'}>

            <div className={styles.container}>
                <img src={ingredient.image_large} alt={ingredient.name} className={styles.mainImage}/>
                <div className={styles.ingredientTitle}>{ingredient.name}</div>
                <div className={styles.infoLine}>
                    <IngredientInfo title={'Калории,ккал'} amount={ingredient.calories}/>
                    <IngredientInfo title={'Белки, г'} amount={ingredient.proteins}/>
                    <IngredientInfo title={'Жиры, г'} amount={ingredient.fat}/>
                    <IngredientInfo title={'Углеводы, г'} amount={ingredient.carbohydrates}/>
                </div>
            </div>
        </Modal>
    )
}

export default IngredientDetails;