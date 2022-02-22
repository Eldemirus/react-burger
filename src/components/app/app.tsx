import React from 'react';
import AppHeader from "../app-header/app-header";
import BurgerIngredients from "../burger-ingridients/burger-ingredients";
import BurgerConstructor from "../burger-constructor/burger-constructor";
// import {data} from '../../utils/data';
import "@ya.praktikum/react-developer-burger-ui-components/dist/ui/box.css";


import appStyles from './app.module.css';
import {Ingredient} from "../common/ingredient";
import ErrorBoundary from "../error-boundary/error-boundary";

const BUN = 'bun';
const URL = 'https://norma.nomoreparties.space/api/ingredients';

function App() {
    const [basket, setBasket] = React.useState<Array<Ingredient>>([]);
    const [data, setData] = React.useState<Array<Ingredient>>([]);

    const addIngredient = (ingredient: any) => {
        const newBasket = [...basket];
        if (ingredient.type === BUN) {
            const bun = newBasket.find(element => element.type === BUN);
            if (bun) {
                newBasket.splice(newBasket.indexOf(bun), 1);
            }
        }
        setBasket([...newBasket, ingredient])
    }
    const delIngredient = (index: number) => {
        const newBasket = [...basket];
        newBasket.splice(index, 1);
        setBasket(newBasket);
    };

    React.useEffect(() => {
        fetch(URL)
            .then(response => response.json())
            .then(answer => {
                if (answer.success) {
                    setData(answer.data)
                } else {
                    throw new Error('ошибка получения данных');
                }
            })
            .catch(err => console.log('ERROR', err));
    }, []);

    React.useEffect(() => {
        if (data.length > 0){
            setBasket([data[0], data[5], data[7], data[11]]);
        }
    }, [data]);

    return (
        <>
            <ErrorBoundary>
                <AppHeader/>
                <main className={appStyles.main}>
                    <BurgerIngredients basket={basket} ingredients={data} onClick={addIngredient}/>
                    <BurgerConstructor basket={basket} onDelete={delIngredient}/>
                </main>
            </ErrorBoundary>
        </>
    );
}

export default App;
