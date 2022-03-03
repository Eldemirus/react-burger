import React, {useReducer, useState} from 'react';
import AppHeader from "../app-header/app-header";
import BurgerIngredients from "../burger-ingridients/burger-ingredients";
import BurgerConstructor from "../burger-constructor/burger-constructor";
import {Ingredient} from "../common/ingredient";
import ErrorBoundary from "../error-boundary/error-boundary";
import "@ya.praktikum/react-developer-burger-ui-components/dist/ui/box.css";
import appStyles from './app.module.css';
import {getIngredients} from "../../utils/api";
import {initialOrderState, OrderAction, OrderContext, orderReducerFun, OrderState} from '../../utils/order-context';

function App() {
    const [data, setData] = useState<Array<Ingredient>>([]);

    const [orderState, orderDispatch] =
        useReducer<React.Reducer<OrderState,OrderAction>, OrderState>(orderReducerFun, initialOrderState, ()=>initialOrderState);

    React.useEffect(() => {
        getIngredients()
            .then(setData)
            .catch(error => console.error('ошибка загрузки ингредиентов', error));
    }, []);

    return (
        <>
            <ErrorBoundary>
                <AppHeader/>
                <main className={appStyles.main}>
                        <OrderContext.Provider value={{orderState, orderDispatch}}>

                            <BurgerIngredients ingredients={data}/>
                            <BurgerConstructor />
                        </OrderContext.Provider>
                </main>
            </ErrorBoundary>
        </>
    );
}

export default App;
