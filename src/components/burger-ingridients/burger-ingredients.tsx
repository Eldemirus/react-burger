import {Counter, Tab} from '@ya.praktikum/react-developer-burger-ui-components';
import ingStyles from './burger-ingredients.module.css';
import React, {useCallback, useEffect, useMemo, useRef} from "react";
import Price from "../price/price";
import {Ingredient, INGREDIENT_TYPE} from "../common/ingredient";
import {useDispatch, useSelector} from "../../services/store";
import {DragSourceMonitor, useDrag} from "react-dnd";
import {addItem, BUN} from "../../services/reducers/cart";
import {useLocation, useNavigate} from "react-router-dom";


export interface BoxProps {
    name: string
}

interface DropResult {
    allowedDropEffect: string
    dropEffect: string
    name: string
}

const BurgerIngredient: React.FC<{
    ingredient: Ingredient;
}> = ({ingredient}) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [{opacity}, drag] = useDrag(
        () => ({
            type: INGREDIENT_TYPE,
            item: {id: ingredient._id, name: ingredient.name},
            end(item, monitor) {
                const dropResult = monitor.getDropResult() as DropResult
                if (item && dropResult) {
                    addItemHandler()
                }
            },
            collect: (monitor: DragSourceMonitor) => ({
                opacity: monitor.isDragging() ? 0.4 : 1,
            }),
        }),
        [ingredient],
    )

    const showIngredientDetails = useCallback(() => {
        navigate(`/ingredient/${ingredient._id}`, {state: {background: location}});
    }, [ingredient, navigate, location]);

    const addItemHandler = useCallback(() => {
        dispatch(addItem(ingredient));
    }, [dispatch, ingredient])


    return (
        <div
            ref={drag}
            className={ingStyles.ingredientCard}
            style={{opacity}}
            onClick={showIngredientDetails}
        >
            {ingredient.amount > 0 && (
                <Counter count={ingredient.amount} size="default"/>
            )}
            <img src={ingredient.image} alt={ingredient.name} className="px-4"/>
            <Price value={ingredient.price} className='py-1'/>
            <div className={ingStyles.ingredientTitle}>{ingredient.name}</div>
        </div>
    )
}


const BurgerIngredientGroup: React.FC<{
    title: string;
    type: string;
    items: Ingredient[];
}> = ({title, type, items}) => {
    return (
        <div className={' pt-10'} id={type}>
            <h1 className="text text_type_main-medium" id={type}>{title}</h1>
            <div className={ingStyles.ingredientTypeGroup}>
                {items && items.map((ingredient: Ingredient) => (
                    <BurgerIngredient
                        key={ingredient._id}
                        ingredient={ingredient}
                    />
                ))}
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

const IngredientTabs: React.FC<{
    ingredientTypes: IngredientTypes[],
    current: string,
    onTabClick: (val: string) => void
}> = ({ingredientTypes, current, onTabClick}) => {
    return (
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
}

type IngredientCounts = {[name:string]: Array<Ingredient>};

const BurgerIngredients: React.FC = () => {
    const [current, setCurrent] = React.useState(BUN)
    const {
        ingredients,
        ingredientsLoading,
        ingredientsFailed
    } = useSelector(state => state.ingredients);

    const scrollerRef = useRef<HTMLHeadingElement>(null);

    const onTabClick = useCallback((val: string) => {
        const element = document.getElementById(val);
        if (element) {
            element.scrollIntoView({behavior: "smooth"});
        }
    }, [])

    const ingredientsByType = useMemo(() => {
        return ingredientTypes.reduce((counts: IngredientCounts, type: IngredientTypes) => {
            counts[type.type] = ingredients.filter((ingredient: Ingredient) => ingredient.type === type.type);
            return counts;
        }, {} as IngredientCounts);
    }, [ingredients])


    // обработка скролла списка для переключения табов
    useEffect(() => {
        const onScroll = (ev: Event) => {
            const scroller = ev.target as HTMLDivElement;
            let min = Number.MAX_VALUE;
            let nearest = ingredientTypes[0].type;
            ingredientTypes.forEach((type) => {
                const elem = document.getElementById(type.type);
                const currentOffset = Math.abs((elem ? elem.offsetTop : 0) - scroller.offsetTop - scroller.scrollTop);
                if (min > currentOffset) {
                    min = currentOffset;
                    nearest = type.type;
                }
            })
            if (nearest) {
                setCurrent(nearest)
            }
        }
        scrollerRef.current?.addEventListener('scroll', (e) => onScroll(e));
        return scrollerRef.current?.removeEventListener('scroll', (e) => onScroll(e));
    }, [scrollerRef])

    return (
        <section className={ingStyles.main}>
            <h1 className="pt-10 pb-5 text text_type_main-large">Соберите бургер</h1>
            <IngredientTabs ingredientTypes={ingredientTypes} current={current} onTabClick={onTabClick}/>
            {ingredientsLoading || ingredientsFailed ?
                <div className={ingStyles.ingredientCardList}>
                    {ingredientsFailed ? (
                        <div className={ingStyles.error}>
                            Ошибка загрузки ингредиентов
                        </div>
                    ) : (
                        <div className={ingStyles.loading}>
                            Загрузка ингредиентов
                        </div>
                    )}
                </div>
                :
                <div className={ingStyles.ingredientCardList} ref={scrollerRef}>
                    {ingredientTypes
                        .map((ingredientType) => (
                            <BurgerIngredientGroup
                                key={ingredientType.type}
                                type={ingredientType.type}
                                title={ingredientType.title}
                                items={ingredientsByType[ingredientType.type]}
                            >
                            </BurgerIngredientGroup>
                        ))}
                </div>
            }
        </section>
    )
}

export default BurgerIngredients;

