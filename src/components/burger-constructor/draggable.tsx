import React, {FC, useRef} from "react";
import {useDrag, useDrop} from "react-dnd";
import {OrderItem} from "../common/order-item";
import {Identifier, XYCoord} from "dnd-core";

export const ORDER_TYPE = 'order-items';

export const Draggable: FC<{
    index: number,
    id: string,
    moveItems: (from: number, to: number) => void
}> = ({index, moveItems, id, children}) => {
    const ref = useRef<HTMLDivElement>(null)


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
