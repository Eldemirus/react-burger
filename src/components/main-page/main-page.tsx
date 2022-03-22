import styles from "./main-page.module.css";
import BurgerIngredients from "../burger-ingridients/burger-ingredients";
import BurgerConstructor from "../burger-constructor/burger-constructor";
import React, {useCallback} from "react";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {useLocation, useMatch, useNavigate} from "react-router-dom";
import {IngredientDetailsPage} from "../ingredient-details-page/ingredient-details-page";
import Modal from "../modal/modal";
import IngredientDetails from "../ingredient-details/ingredient-details";
import {useSelector} from "react-redux";
import {RootState} from "../../services/store";
import {IngredientsState} from "../../services/reducers/ingredients";

export const MainPage = () => {
    const location = useLocation();
    const state = location.state as {showPopup: boolean}
    const match = useMatch('/ingredient/:id');
    const navigate = useNavigate();
    const {ingredients} = useSelector<RootState, IngredientsState>(state => state.ingredients);

    const hideIngredientDetails = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    let ingredient;
    if (match) {
        ingredient = ingredients.find(ingredient => ingredient._id === match.params.id);
        if (ingredient && (!state || !state.showPopup)) {
            return <IngredientDetailsPage ingredient={ingredient} />
        }
    }


    return (
        <DndProvider backend={HTML5Backend}>
            <main className={styles.main}>
                <BurgerIngredients/>
                <BurgerConstructor/>
            </main>
            {ingredient && (
                <Modal handleClose={hideIngredientDetails} title={'Детали ингредиента'}>
                    <IngredientDetails ingredient={ingredient}/>
                </Modal>
            )}
        </DndProvider>
    )
}