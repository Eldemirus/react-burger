import React, {useCallback, useMemo} from "react";
import styles from './burger-constructor.module.css';
import {Button, ConstructorElement, DragIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import Price from "../common/price";
import OrderDetails from "../order-details/order-details";
import Modal from "../modal/modal";
import {OrderItem} from "../common/order-item";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../services/store";
import {useDrop} from "react-dnd";
import {INGREDIENT_TYPE} from "../common/ingredient";
import {Draggable} from "./draggable";
import {CartState, deleteItem, swapOrderItems} from "../../services/reducers/cart";
import {clearOrderThunk, OrderState, sendOrderThunk} from "../../services/reducers/order";
import {AuthState} from "../../services/reducers/auth";
import {useLocation, useNavigate} from "react-router-dom";

const BurgerConstructor = () => {
    const cartState = useSelector<RootState, CartState>(state => state.cart);
    const orderState = useSelector<RootState, OrderState>(state => state.order);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user} = useSelector<RootState, AuthState>(state => state.auth);
    let location = useLocation();


    const [{canDrop, isOver}, drop] = useDrop(
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

    const onDelete = useCallback((item: OrderItem) => {
        dispatch(deleteItem(item))
    }, [dispatch])

    const total = useMemo(() => {
        return cartState.items.reduce((val, a) => a.ingredient.price + val, 0)
            + (cartState.bunItem ? cartState.bunItem.ingredient?.price : 0) * 2;
    }, [cartState]);

    const isOrderValid = useMemo(() => {
        return cartState.bunItem !== undefined;
    }, [cartState]);

    const onClick = useCallback(() => {
        if (user) {
            dispatch(sendOrderThunk());
        } else {
            navigate('/login', {state: {from: location}})
        }
    }, [dispatch, user, location, navigate])

    const handleClose = useCallback(() => {
        dispatch(clearOrderThunk());
    }, [dispatch])

    const handleCancel = useCallback(() => {
        console.log('отмена заказа не реализована');
    }, [])

    return (
        <>
            <section className={styles.main} ref={drop} style={{border}}>
                {!cartState.bunItem && !cartState.items.length && (
                    <div className={styles.emptyList}>
                        Перетащите ингредиенты для добавления в заказ
                    </div>
                )}

                {cartState.bunItem && (
                    <div className={styles.elementLineTop}>
                        <div className={styles.dragBox}>&nbsp;</div>
                        <ConstructorElement
                            type="top"
                            isLocked={true}
                            text={cartState.bunItem.ingredient.name + ' (верх)'}
                            price={cartState.bunItem.ingredient.price}
                            thumbnail={cartState.bunItem.ingredient.image}
                        />
                    </div>
                )}

                <div className={styles.centerElements}>

                    {cartState.items.map((element, index) => (
                        <Draggable index={index} key={element.id} id={element.id} moveItems={moveItems}>
                            <div className={styles.elementLineInner}>
                                <div className={styles.dragBox}>
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

                {cartState.bunItem && (
                    <div className={styles.elementLineBottom}>
                        <div className={styles.dragBox}>&nbsp;</div>
                        <ConstructorElement
                            type="bottom"
                            isLocked={true}
                            text={cartState.bunItem.ingredient.name + ' (низ)'}
                            price={cartState.bunItem.ingredient.price}
                            thumbnail={cartState.bunItem.ingredient.image}
                        />
                    </div>
                )}
                {
                    total > 0 &&
                    <div className={styles.totalLine}>
                        <Price value={total} size={'medium'}/>
                        <Button type="primary" onClick={onClick} disabled={orderState.orderSending || !isOrderValid}>
                            Оформить заказ
                        </Button>
                    </div>
                }
                {orderState.orderFailed && (
                    <div className={styles.errorMessage}>
                        Ошибка обработки заказа
                    </div>
                )}
            </section>
            {orderState.order && (
                <Modal handleClose={handleClose}>
                    <OrderDetails order={orderState.order}/>
                </Modal>
            )}
            {orderState.orderSending && (
                <Modal handleClose={handleCancel} title={'Обработка'}>
                    <div className={styles.loading}>
                        Ждите - выполняется обработка заказа
                    </div>
                </Modal>
            )}
        </>
    )
}

export default BurgerConstructor;