import React from 'react';
import AppHeader from "../app-header/app-header";
import BurgerIngredients from "../burger-ingridients/burger-ingredients";
import BurgerConstructor from "../burger-constructor/burger-constructor";
import ErrorBoundary from "../error-boundary/error-boundary";
import "@ya.praktikum/react-developer-burger-ui-components/dist/ui/box.css";
import appStyles from './app.module.css';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from "react-dnd-html5-backend";

function App() {

    return (
        <>
            <ErrorBoundary>
                <AppHeader/>
                <DndProvider backend={HTML5Backend}>
                    <main className={appStyles.main}>
                        <BurgerIngredients/>
                        <BurgerConstructor/>
                    </main>
                </DndProvider>
            </ErrorBoundary>
        </>
    );
}

export default App;
