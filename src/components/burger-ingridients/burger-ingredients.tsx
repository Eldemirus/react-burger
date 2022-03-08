import {Counter, Tab} from '@ya.praktikum/react-developer-burger-ui-components';
import ingStyles from './burger-ingredients.module.css';
import React, {useEffect, useMemo, useRef} from "react";
import Price from "../common/price";
import {Ingredient} from "../common/ingredient";
import IngredientDetails from "../ingredient-details/ingredient-details";
import Modal from "../modal/modal";
import {useDispatch, useSelector} from "react-redux";
import {addOrderItem, OrderState} from "../../services/reducers/order";
import {RootState} from "../../services/store";
import {OrderItem} from "../common/order-item";
import {clearIngredientInfo, IngredientsState, setIngredientInfo} from "../../services/reducers/ingredients";

const BurgerIngredient: React.FC<{
    ingredient: Ingredient;
    amount: number;
}> = ({ingredient, amount}) => {
    const dispatch = useDispatch();
    const click = (e: any) => {
        e.preventDefault();
        addItem();
    }
    const showIngredientDetails = React.useCallback(() => {
        dispatch(setIngredientInfo(ingredient));
    }, [dispatch, ingredient]);

    const addItem = () => {
        dispatch(addOrderItem(ingredient));
    }


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
        </>
    )
}


const BurgerIngredientGroup: React.FC<{
    title: string;
    type: string;
}> = ({title, type, children}) => {
    return (
        <div className={' pt-10'} id={type}>
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

const BurgerIngredients: React.FC = () => {
    const [current, setCurrent] = React.useState('bun')
    const dispatch = useDispatch();
    const orderState = useSelector<RootState>(state => state.order) as OrderState;
    const {ingredients, ingredientInfo} = useSelector<RootState>(state => state.ingredients) as IngredientsState;
    const scrollerRef = useRef<HTMLHeadingElement>(null);


    const onTabClick = (val: string) => {
        const element = document.getElementById(val);
        if (element) {
            element.scrollIntoView({behavior: "smooth"});
        }
        // setCurrent(val);
    }

    const hideIngredientDetails = React.useCallback(() => {
        dispatch(clearIngredientInfo())
    }, [dispatch]);

    const itemCounter = useMemo(() => orderState.items.reduce((acc: any, curr: OrderItem) => {
        if (acc[curr.ingredient._id]) {
            ++acc[curr.ingredient._id]
        } else {
            acc[curr.ingredient._id] = 1;
        }
        return acc;
    }, {}), [orderState.items]);

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


    useEffect(() => {
        const onScroll = (ev: Event) => {
            const scroller = ev.target as HTMLDivElement;
            let min = Number.MAX_VALUE;
            let nearest = 'bun';
            ingredientTypes.forEach((type) => {
                const elem = document.getElementById(type.type);
                const currentOffset = Math.abs((elem? elem.offsetTop:0) - scroller.offsetTop - scroller.scrollTop);
                if (min > currentOffset) {
                    min = currentOffset;
                    nearest = type.type;
                }
            })
            if (nearest){
                setCurrent(nearest)
            }
        }
        scrollerRef.current?.addEventListener('scroll', (e)=> onScroll(e));
        return scrollerRef.current?.removeEventListener('scroll', (e)=> onScroll(e));
    }, [scrollerRef])

    return (
        <section className={ingStyles.main}>
            <h1 className="pt-10 pb-5 text text_type_main-large">Соберите бургер</h1>
            <IngredientTabs/>
            <div className={ingStyles.ingredientCardList} ref={scrollerRef}>
                {ingredientTypes
                    .map((ingredientType) => (
                        <BurgerIngredientGroup
                            key={ingredientType.type}
                            type={ingredientType.type}
                            title={ingredientType.title}
                        >
                            {getIngredientsByType(ingredientType.type)
                                .map((ingredient) => (
                                    <BurgerIngredient
                                        key={ingredient._id}
                                        ingredient={ingredient}
                                        amount={itemCounter[ingredient._id]}
                                    />
                                ))}
                        </BurgerIngredientGroup>
                    ))}
            </div>
            {ingredientInfo &&
                <Modal handleClose={hideIngredientDetails} title={'Детали ингредиента'}>
                    <IngredientDetails ingredient={ingredientInfo}/>
                </Modal>
            }
        </section>
    )
}

export default BurgerIngredients;

