import React from "react";
import styles from "./order-details.module.css";
import {Order} from "../common/order";
import image from "../../images/order-check.svg";
import {CheckMarkIcon} from "@ya.praktikum/react-developer-burger-ui-components";

interface OrderProps {
    order?: Order;
}

const OrderDetails: React.FC<OrderProps> = ({order}) => {

    return (
        <div className={styles.container}>
            <div className={styles.orderId}>{order?.id}</div>
            <p className={'text text_type_main-medium mt-8'}>идентификатор заказа</p>
            <div className={styles.imageBox} style={{
                backgroundImage: `url(${image})`
            }}>
                <CheckMarkIcon type="primary"/>
            </div>
            <div className={'text text_type_main-default mb-2'}>
                Ваш заказ начали готовить
            </div>
            <div className={'text text_type_main-default text_color_inactive mb-30'}>
                Дождитесь готовности на орбитальной станции
            </div>
        </div>
    )
}

export default OrderDetails;