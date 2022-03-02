import {Counter, Tab} from '@ya.praktikum/react-developer-burger-ui-components';
import ingStyles from './burger-ingredients.module.css';
import React, {useContext, useMemo} from "react";
import Price from "../common/price";
import {Ingredient} from "../common/ingredient";
import IngredientDetails from "../ingredient-details/ingredient-details";
import Modal from "../modal/modal";
import {OrderActionKind, OrderContext, OrderContextType} from "../../utils/order-context";

const BurgerIngredient: React.FC<{
    ingredient: Ingredient;
    amount: number
    onClick: (ingredient: Ingredient) => void;
}> = ({ingredient, amount, onClick}) => {
    const [showDetails, setShowDetails] = React.useState(false);
    const click = (e: any) => {
        e.preventDefault();
        onClick(ingredient);
    }
    const showIngredientDetails = React.useCallback(() => {
        setShowDetails(true);
    }, []);

    const hideIngredientDetails = React.useCallback(() => {
        setShowDetails(false)
    }, []);

    return (
        <>
            <div
                className={ingStyles.ingredientCard}
                onContextMenu={click}
                onClick={showIngredientDetails}
            >
                {amount > 0 && (
                    <Counter count={amount} size="default"/>
                )}
                <img src={ingredient.image} alt={ingredient.name} className="px-4"/>
                <Price value={ingredient.price} className='py-1'/>
                <div className={ingStyles.ingredientTitle}>{ingredient.name}</div>
            </div>
            {showDetails &&
                <Modal handleClose={hideIngredientDetails} title={'Детали ингредиента'}>
                    <IngredientDetails ingredient={ingredient}/>
                </Modal>
            }
        </>
    )
}


const BurgerIngredientGroup: React.FC<{
    title: string;
    type: string;
}> = ({title, type, children}) => {
    return (
        <div className={' pt-10'}>
            <h1 className="text text_type_main-medium" id={type}>{title}</h1>
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

const ingredientTypes: IngredientTypes[] = [
    {type: "bun", title: "Булки"},
    {type: "main", title: "Начинки"},
    {type: "sauce", title: "Соусы"},
];

const BurgerIngredients: React.FC<{
    ingredients: Array<Ingredient>;
}> = ({ingredients}) => {
    const [current, setCurrent] = React.useState('bun')
    const {orderState, orderDispatch} = useContext<OrderContextType>(OrderContext);

    const onTabClick = (val: string) => {
        const element = document.getElementById(val);
        if (element) {
            element.scrollIntoView({behavior: "smooth"});
        }
        setCurrent(val);
    }

    const addItem = (ingredient: Ingredient) => {
        orderDispatch({type: OrderActionKind.ADD, payload: ingredient});
    }


    const itemCounter = useMemo(() => orderState.items.reduce((acc: any, curr) => {
        if (acc[curr.ingredient._id]) {
            ++acc[curr.ingredient._id]
        } else {
            acc[curr.ingredient._id] = 1;
        }
        return acc;
    }, {}), [orderState]);

    const getIngredientsByType = (type: string) => ingredients.filter((ingredient: Ingredient) => ingredient.type === type);

    const IngredientTabs = () => (
        <div className={ingStyles.tabBar}>
            {
                ingredientTypes.map(ingredientType => (
                    <Tab
                        key={ingredientType.type}
                        value={ingredientType.type}
                        active={current === ingredientType.type}
                        onClick={onTabClick}
                    >
                        {ingredientType.title}
                    </Tab>
                ))
            }
        </div>
    )

    return (
        <section className={ingStyles.main}>
            <h1 className="pt-10 pb-5 text text_type_main-large">Соберите бургер</h1>
            <IngredientTabs />
            <div className={ingStyles.ingredientCardList}>
                {ingredientTypes
                    .map((ingredientType) => (
                        <BurgerIngredientGroup key={ingredientType.type}
                                               type={ingredientType.type}
                                               title={ingredientType.title}>
                            {getIngredientsByType(ingredientType.type)
                                .map((ingredient) => (
                                    <BurgerIngredient
                                        key={ingredient._id}
                                        ingredient={ingredient}
                                        onClick={(ingredient) => addItem(ingredient)}
                                        amount={itemCounter[ingredient._id]}
                                    />
                                ))}
                        </BurgerIngredientGroup>
                    ))}
            </div>
        </section>
    )
}

export default BurgerIngredients;

