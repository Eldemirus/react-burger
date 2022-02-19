import {Counter, Tab} from '@ya.praktikum/react-developer-burger-ui-components';
import ingStyles from './burger-ingredients.module.css';
import React from "react";
import Price from "../common/price";

const BurgerIngredient: React.FC<{
    ingredient: any;
    amount: number
    onClick: Function;
}> = ({ingredient, amount, onClick}) => {
    const click = () => {
        onClick(ingredient);
    }
    return (
        <div className={ingStyles.ingredientCard} onClick={click}>
            {amount > 0 && (
                <Counter count={amount} size="default"/>
            )}
            <img src={ingredient.image} alt={ingredient.name} className="px-4"/>
            <Price value={ingredient.price} className='py-1'/>
            <div className={ingStyles.ingredientTitle}>{ingredient.name}</div>
        </div>
    )
}


const BurgerIngredientGroup: React.FC<{
    title: string;
}> = ({title, children}) => {
    return (
        <>
            <h1 className="text text_type_main-medium">{title}</h1>
            <div className={ingStyles.ingredientTypeGroup}>
                {children}
            </div>
        </>
    )
}


const BurgerIngredients: React.FC<{
    ingredients: Array<any>;
    basket: Array<any>;
    onClick: Function;
}> = ({ingredients, basket, onClick}) => {
    const [current, setCurrent] = React.useState('bun')

    const types = [
        {type: "bun", title: "Булки"},
        {type: "main", title: "Начинки"},
        {type: "sauce", title: "Соусы"},
    ];

    const countItems = (ingredient:any) => {
        const count = basket.filter(elem => elem._id === ingredient._id).length;
        console.log('COUNT', ingredient, count);
        return count;
    }

    return (
        <section className={ingStyles.main}>
            <h1 className="pt-10 pb-5 text text_type_main-large">Соберите бургер</h1>
            <div className={ingStyles.tabBar}>
                <Tab value="bun" active={current === 'bun'} onClick={setCurrent}>Булки</Tab>
                <Tab value="sauce" active={current === 'sauce'} onClick={setCurrent}>Соусы</Tab>
                <Tab value="main" active={current === 'main'} onClick={setCurrent}>Начинки</Tab>
            </div>
            <div className={ingStyles.ingredientCardList}>
                {types
                    .filter(type => type.type === current)
                    .map((ingredientType) => (
                        <div className={' pt-10'} key={ingredientType.type}>
                            <BurgerIngredientGroup title={ingredientType.title}>
                                {ingredients
                                    .filter(ingredient => ingredient.type === ingredientType.type)
                                    .map((ingredient, index) => (
                                        <BurgerIngredient
                                            key={index}
                                            ingredient={ingredient}
                                            onClick={onClick}
                                            amount={countItems(ingredient)}
                                        />
                                    ))}
                            </BurgerIngredientGroup>
                        </div>
                    ))}
            </div>
        </section>
    )
}

export default BurgerIngredients;