import React from 'react';
import AppHeader from "../app-header/app-header";
import BurgerIngredients from "../burger-ingridients/burger-ingredients";
import BurgerConstructor from "../burger-constructor/burger-constructor";
import {data} from '../../utils/data';
import "@ya.praktikum/react-developer-burger-ui-components/dist/ui/box.css";


import appStyles from './app.module.css';

const BUN = 'bun';

function App() {
    const [basket, setBasket] = React.useState<Array<any>>([]);

    const addIngredient = (ingredient: any) => {
        const newBasket = [...basket];
        if (ingredient.type === BUN) {
            const bun = newBasket.find(element => element.type === BUN);
            if (bun) {
                newBasket.splice(newBasket.indexOf(bun), 1);
            }
        }
        setBasket([...newBasket, ingredient])
    };
    const delIngredient = (index: number) => {
        const newBasket = [...basket];
        newBasket.splice(index, 1);
        setBasket(newBasket);
    };

    return (
        <>
            <AppHeader/>
            <main className={appStyles.main}>
                <BurgerIngredients basket={basket} ingredients={data} onClick={addIngredient}/>
                <BurgerConstructor basket={basket} onDelete={delIngredient}/>
            </main>
        </>
    );
}

export default App;
