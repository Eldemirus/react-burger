import constructorStyles from './burger-constructor.module.css';
import React from "react";
import {Button, ConstructorElement, DragIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import Price from "../common/price";

const BurgerConstructor: React.FC<{
    basket: Array<any>;
    ingredients: Array<any>;
    onDelete: Function;
}> = ({basket, ingredients, onDelete}) => {
    const topElement = basket.find(element => element.type === 'bun');
    const elements = basket.filter(element => element.type !== 'bun');

    let total = basket.reduce((val, a) => a.price + val, 0);

    return (
        <>
            <section className={constructorStyles.main}>
                {topElement && (
                    <div className={constructorStyles.elementLineTop}>
                        <ConstructorElement
                            type="top"
                            isLocked={true}
                            text={topElement.name}
                            price={topElement.price}
                            thumbnail={topElement.image}
                        />
                    </div>
                )}

                <div className={constructorStyles.centerElements}>

                    {elements.map((element, index) => (
                        <div className={constructorStyles.elementLineInner} key={index}>
                            <DragIcon type="primary"/>
                            <ConstructorElement
                                key={index}
                                text={element.name}
                                price={element.price}
                                handleClose={() => onDelete(basket.indexOf(element))}
                                thumbnail={element.image}
                            />
                        </div>

                    ))}
                </div>

                {topElement && (
                    <div className={constructorStyles.elementLineBottom}>
                        <ConstructorElement
                            type="bottom"
                            isLocked={true}
                            text={topElement.name}
                            price={topElement.price}
                            thumbnail={topElement.image}
                        />
                    </div>
                )}

                <div className={constructorStyles.totalLine}>
                    <Price value={total}/>
                    <Button type="primary">Оформить заказ</Button>
                </div>
            </section>
        </>
    )
}

export default BurgerConstructor;