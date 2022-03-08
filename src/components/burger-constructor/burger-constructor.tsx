import React from "react";
import constructorStyles from './burger-constructor.module.css';
import {Button, ConstructorElement, DragIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import Price from "../common/price";
import OrderDetails from "../order-details/order-details";
import {Order} from "../common/order";
import Modal from "../modal/modal";
import {sendOrder} from "../../utils/api";
import {OrderItem} from "../common/order-item";
import {useDispatch, useSelector} from "react-redux";
import {clearOrder, deleteOrderItem, OrderState, setOrder} from "../../services/reducers/order";
import {RootState} from "../../services/store";


const BurgerConstructor = () => {
    const orderState = useSelector<RootState>(state => state.order) as OrderState;
    const dispatch = useDispatch();

    const topElement = orderState.items.find(element => element.ingredient.type === 'bun');
    const elements = orderState.items.filter(element => element.ingredient.type !== 'bun');

    // const total = useMemo(() => {
    //     return elements.reduce((val, a) => a.ingredient.price + val, 0)
    //         + (topElement ? topElement.ingredient?.price : 0) * 2;
    // }, [orderState.items]);

    const onDelete = (item: OrderItem) => {
        dispatch(deleteOrderItem(item))
    }

    const onClick = () => {
        const orderData = orderState.items.map(orderItem => orderItem.ingredient._id);
        sendOrder(orderData)
            .then(orderInfo => {
                const newOrder: Order = {id: orderInfo.order.number, name: orderInfo.name};
                dispatch(setOrder(newOrder));
            })

    }
    const handleClose = React.useCallback(() => {
        dispatch(clearOrder());
    }, [dispatch])

    return (
        <>
            <section className={constructorStyles.main}>
                {topElement && (
                    <div className={constructorStyles.elementLineTop}>
                        <div className={constructorStyles.dragBox}>&nbsp;</div>
                        <ConstructorElement
                            type="top"
                            isLocked={true}
                            text={topElement.ingredient.name + ' (верх)'}
                            price={topElement.ingredient.price}
                            thumbnail={topElement.ingredient.image}
                        />
                    </div>
                )}

                <div className={constructorStyles.centerElements}>

                    {elements.map((element) => (
                        <div className={constructorStyles.elementLineInner} key={element.id}>
                            <div className={constructorStyles.dragBox}>
                                <DragIcon type="primary"/>
                            </div>
                            <ConstructorElement
                                key={element.id}
                                text={element.ingredient.name}
                                price={element.ingredient.price}
                                handleClose={() => onDelete(element)}
                                thumbnail={element.ingredient.image}
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
                            text={topElement.ingredient.name + ' (низ)'}
                            price={topElement.ingredient.price}
                            thumbnail={topElement.ingredient.image}
                        />
                    </div>
                )}
                {
                    orderState.total > 0 &&
                    <div className={constructorStyles.totalLine}>
                        <Price value={orderState.total} size={'medium'}/>
                        <Button type="primary" onClick={onClick}>Оформить заказ</Button>
                    </div>
                }
            </section>
            {orderState.order && (
                <Modal handleClose={handleClose}>
                    <OrderDetails order={orderState.order}/>
                </Modal>
            )}
        </>
    )
}

export default BurgerConstructor;