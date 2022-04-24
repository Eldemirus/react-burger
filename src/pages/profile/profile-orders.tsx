import React, {useEffect} from "react";
import {useDispatch, useSelector} from "../../services/store";
import {OrderPreview} from "../../components/order-preview/order-preview";
import styles from './profile.module.css';

export const ProfileOrders = () => {
    const dispatch = useDispatch();
    const {orders} = useSelector(state => state.orderList);
    const {token} = useSelector(state => state.auth);

    useEffect(() => {
        dispatch({type: 'WS_CONNECTION_START', payload: `orders?token=${token}`})
        return () => {
            dispatch({type: 'WS_CONNECTION_STOP'})
        }
    }, [dispatch, token])

    return (
        <div className={styles.feedContainer}>
            {orders.map(order => (
                <OrderPreview order={order} key={order._id} showStatus={true}/>
            ))}

        </div>
    );

}
