import React, {FC, useCallback, useRef} from "react";
import constructorStyles from './burger-constructor.module.css';
import {Button, ConstructorElement, DragIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import Price from "../common/price";
import OrderDetails from "../order-details/order-details";
import {Order} from "../common/order";
import Modal from "../modal/modal";
import {sendOrder} from "../../utils/api";
import {OrderItem} from "../common/order-item";
import {useDispatch, useSelector} from "react-redux";
import {clearOrder, deleteOrderItem, OrderState, setOrder, swapOrderItems} from "../../services/reducers/order";
import {RootState} from "../../services/store";
import {useDrag, useDrop} from "react-dnd";
import type {XYCoord, Identifier} from 'dnd-core'


const Draggable: FC<{
    index: number,
    id: string,
    moveItems: (from: number, to: number) => void
}> = ({index, moveItems, id, children}) => {
    const ref = useRef<HTMLDivElement>(null)

    const ORDER_TYPE = 'order-items';

    const [{handlerId}, drop] = useDrop<OrderItem,
        void,
        { handlerId: Identifier | null }>({
        accept: ORDER_TYPE,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item: OrderItem, monitor) {
            if (!ref.current || typeof item.index === 'undefined') {
                return
            }
            const dragIndex = item.index
            const hoverIndex = index

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect()

            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

            // Determine mouse position
            const clientOffset = monitor.getClientOffset()

            // Get pixels to the top
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }

            // Time to actually perform the action
            moveItems(dragIndex, hoverIndex)

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex
        },
    })

    const [{isDragging}, drag] = useDrag({
        type: ORDER_TYPE,
        item: () => {
            return {id, index}
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    const opacity = isDragging ? 0 : 1
    drag(drop(ref))

    return (
        <div ref={ref} data-hanler-id={handlerId} style={{opacity}}>
            {children}
        </div>
    )
}

const BurgerConstructor = () => {
    const orderState = useSelector<RootState>(state => state.order) as OrderState;
    const dispatch = useDispatch();

    const moveItems = useCallback((dragIndex: number, hoverIndex: number) => {
        dispatch(swapOrderItems({from: dragIndex, to: hoverIndex}));
    }, [dispatch])

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