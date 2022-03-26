import styles from "./main-page.module.css";
import BurgerIngredients from "../../components/burger-ingridients/burger-ingredients";
import BurgerConstructor from "../../components/burger-constructor/burger-constructor";
import React from "react";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

export const MainPage = () => {

    return (
        <DndProvider backend={HTML5Backend}>
            <main className={styles.main}>
                <BurgerIngredients/>
                <BurgerConstructor/>
            </main>
        </DndProvider>
    )
}