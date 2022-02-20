import {Counter, Tab} from '@ya.praktikum/react-developer-burger-ui-components';
import ingStyles from './burger-ingredients.module.css';
import React from "react";
import Price from "../common/price";
import {Ingredient} from "../common/ingredient";

const BurgerIngredient: React.FC<{
    ingredient: Ingredient;
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
        <div className={' pt-10'}>
            <h1 className="text text_type_main-medium">{title}</h1>
            <div className={ingStyles.ingredientTypeGroup}>
                {children}
            </div>
        </div>
    )
}

interface IngredientTypes {
    type: string;
    title: string;
}

const BurgerIngredients: React.FC<{
    ingredients: Array<Ingredient>;
    basket: Array<Ingredient>;
    onClick: Function;
}> = ({ingredients, basket, onClick}) => {
    const [current, setCurrent] = React.useState('bun')

    const ingredientTypes: IngredientTypes[] = [
        {type: "bun", title: "Булки"},
        {type: "main", title: "Начинки"},
        {type: "sauce", title: "Соусы"},
    ];

    const countItems = (ingredient: any) => {
        return basket.filter(elem => elem._id === ingredient._id).length;
    }

    const getIngredientsByType = (type: string) => ingredients.filter(ingredient => ingredient.type === type);

    return (
        <section className={ingStyles.main}>
            <h1 className="pt-10 pb-5 text text_type_main-large">Соберите бургер</h1>
            <div className={ingStyles.tabBar}>
                {
                    ingredientTypes.map(ingredientType => (
                        <Tab
                            key={ingredientType.type}
                            value={ingredientType.type}
                            active={current === ingredientType.type}
                            onClick={setCurrent}
                        >
                            {ingredientType.title}
                        </Tab>
                    ))
                }
            </div>
            <div className={ingStyles.ingredientCardList}>
                {ingredientTypes
                    .map((ingredientType) => (
                        <BurgerIngredientGroup key={ingredientType.type} title={ingredientType.title}>
                            {getIngredientsByType(ingredientType.type)
                                .map((ingredient) => (
                                    <BurgerIngredient
                                        key={ingredient._id}
                                        ingredient={ingredient}
                                        onClick={onClick}
                                        amount={countItems(ingredient)}
                                    />
                                ))}
                        </BurgerIngredientGroup>
                    ))}
            </div>
        </section>
    )
}

export default BurgerIngredients;

