import React, {useCallback, useMemo} from "react";
import constructorStyles from './burger-constructor.module.css';
import {Button, ConstructorElement, DragIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import Price from "../common/price";
import OrderDetails from "../order-details/order-details";
import {Order} from "../common/order";
import Modal from "../modal/modal";
import {sendOrder} from "../../utils/api";
import {OrderItem} from "../common/order-item";
import {useDispatch, useSelector} from "react-redux";
import {clearOrderThunk, deleteItem, OrderState, setOrder, swapOrderItems} from "../../services/reducers/order";
import {RootState} from "../../services/store";
import {useDrop} from "react-dnd";
import {INGREDIENT_TYPE} from "../common/ingredient";
import {Draggable} from "./draggable";

const BurgerConstructor = () => {
    const orderState = useSelector<RootState>(state => state.order) as OrderState;
    const dispatch = useDispatch();

    const [{ canDrop, isOver }, drop] = useDrop(
        () => ({
            accept: INGREDIENT_TYPE,
            drop: () => ({
                name: `Dustbin`,
            }),
            collect: (monitor: any) => ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
            }),
        }),
        [],
    )

    const isActive = canDrop && isOver
    const border = isActive ? '1px dashed green' : 'none';

    const moveItems = useCallback((dragIndex: number, hoverIndex: number) => {
        dispatch(swapOrderItems({from: dragIndex, to: hoverIndex}));
    }, [dispatch])

    const onDelete = (item: OrderItem) => {
        dispatch(deleteItem(item))
    }

    const total = useMemo(() => {
        return orderState.items.reduce((val, a) => a.ingredient.price + val, 0)
            + (orderState.bunItem ? orderState.bunItem.ingredient?.price : 0) * 2;
    }, [orderState]);

    const onClick = () => {
        const orderData = orderState.items.map(orderItem => orderItem.ingredient._id);
        sendOrder(orderData)
            .then(orderInfo => {
                const newOrder: Order = {id: orderInfo.order.number, name: orderInfo.name};
                dispatch(setOrder(newOrder));
            })

    }
    const handleClose = React.useCallback(() => {
        dispatch(clearOrderThunk());
    }, [dispatch])

    return (
        <>
            <section className={constructorStyles.main} ref={drop} style={{border}}>
                {orderState.bunItem && (
                    <div className={constructorStyles.elementLineTop}>
                        <div className={constructorStyles.dragBox}>&nbsp;</div>
                        <ConstructorElement
                            type="top"
                            isLocked={true}
                            text={orderState.bunItem.ingredient.name + ' (верх)'}
                            price={orderState.bunItem.ingredient.price}
                            thumbnail={orderState.bunItem.ingredient.image}
                        />
                    </div>
                )}

                <div className={constructorStyles.centerElements}>

                    {orderState.items.map((element, index) => (
                        <Draggable index={index} key={element.id} id={element.id} moveItems={moveItems}>
                            <div className={constructorStyles.elementLineInner}>
                                <div className={constructorStyles.dragBox}>
                                    <DragIcon type="primary"/>
                                </div>
                                <ConstructorElement
                                    text={element.ingredient.name}
                                    price={element.ingredient.price}
                                    handleClose={() => onDelete(element)}
                                    thumbnail={element.ingredient.image}
                                />
                            </div>
                        </Draggable>
                    ))}
                </div>

                {orderState.bunItem && (
                    <div className={constructorStyles.elementLineBottom}>
                        <div className={constructorStyles.dragBox}>&nbsp;</div>
                        <ConstructorElement
                            type="bottom"
                            isLocked={true}
                            text={orderState.bunItem.ingredient.name + ' (низ)'}
                            price={orderState.bunItem.ingredient.price}
                            thumbnail={orderState.bunItem.ingredient.image}
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
            {orderState.order && (
                <Modal handleClose={handleClose}>
                    <OrderDetails order={orderState.order}/>
                </Modal>
            )}
        </>
    )
}

export default BurgerConstructor;