import React, {useMemo} from "react";
import constructorStyles from './burger-constructor.module.css';
import {Button, ConstructorElement, DragIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import Price from "../common/price";
import {Ingredient} from "../common/ingredient";
import OrderDetails from "../order-details/order-details";
import {Order} from "../common/order";
import Modal from "../modal/modal";

interface BurgerContructorProps {
    basket: Array<Ingredient>;
    onDelete: (index: number) => void;
}

const BurgerConstructor: React.FC<BurgerContructorProps> = ({basket, onDelete}) => {
    const [order, setOrder] = React.useState<Order>();

    const topElement = basket.find(element => element.type === 'bun');
    const elements = basket.filter(element => element.type !== 'bun');

    const total = useMemo(() => basket.reduce((val, a) => a.price + val, 0), [basket]);

    const onClick = () => {
        const orderId:string = String(Math.round(Math.random() * 100000)).padStart(6, '0');
        const newOrder: Order = {id: orderId};
        setOrder(newOrder);
    }
    const handleClose = React.useCallback(() => {
        setOrder(undefined);
    }, [])

    return (
        <>
            <section className={constructorStyles.main}>
                {topElement && (
                    <div className={constructorStyles.elementLineTop}>
                        <div className={constructorStyles.dragBox}>&nbsp;</div>
                        <ConstructorElement
                            type="top"
                            isLocked={true}
                            text={topElement.name + ' (верх)'}
                            price={topElement.price}
                            thumbnail={topElement.image}
                        />
                    </div>
                )}

                <div className={constructorStyles.centerElements}>

                    {elements.map((element, index) => (
                        <div className={constructorStyles.elementLineInner} key={index}>
                            <div className={constructorStyles.dragBox}>
                                <DragIcon type="primary"/>
                            </div>
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
                        <div className={constructorStyles.dragBox}>&nbsp;</div>
                        <ConstructorElement
                            type="bottom"
                            isLocked={true}
                            text={topElement.name + ' (низ)'}
                            price={topElement.price}
                            thumbnail={topElement.image}
                        />
                    </div>
                )}
                {
                    total > 0 &&
                    <div className={constructorStyles.totalLine}>
                        <Price value={total} size={'medium'}/>
                        <Button type="primary" onClick={onClick}>Оформить заказ</Button>
                    </div>
                }
            </section>
            {order && (
                <Modal handleClose={handleClose}>
                    <OrderDetails order={order}/>
                </Modal>
            )}
        </>
    )
}

export default BurgerConstructor;