import React, {FC, useEffect, useMemo} from "react";
import styles from './feed.module.css';
import {OrderPreview} from "../../components/order-preview/order-preview";
import {Order} from "../../components/common/order";
import {RootState, useDispatch} from "../../services/store";
import {useSelector} from "react-redux";
import {OrderListState} from "../../services/reducers/order-list";


type OrderStatusListProps = { orders: Array<Order>, name: string }

const OrderStatusList: FC<OrderStatusListProps> = ({orders, name}) => {
  return (
      <div className={styles.orderStatusList}>
        <h1 className={styles.orderStatusListName}>{name}:</h1>
        <div className={styles.orderStatusListNumbers}>
          {orders.map(order => (
              <div>{order.number}</div>
          ))}
        </div>
      </div>
  );
}

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const {orders, totalToday, total} = useSelector<RootState, OrderListState>(state => state.orderList);

  useEffect(() => {
    dispatch({type: 'WS_CONNECTION_START', payload: 'orders/all'})
    return () => {
      dispatch({type: 'WS_CONNECTION_STOP'})
    }
  }, [dispatch])

  const ordersReady = useMemo(() => orders.filter(order => order.status === 'pending'), [orders]);
  const ordersWorking = useMemo(() => orders.filter(order => order.status === 'created'), [orders]);

  return (
      <>
        <div className={styles.main}>
          <div className={styles.headerContainer}>Лента заказов</div>
          <div className={styles.feedContainer}>
            {orders.map(order => (
                <OrderPreview order={order} key={order._id}/>
            ))}

          </div>
          <div className={styles.infoContainer}>
            <div className={styles.statusListContainer}>
              <OrderStatusList orders={ordersReady} name={'Готовы'}/>
              <OrderStatusList orders={ordersWorking} name={'В работе'}/>
            </div>
            <div className={styles.orderTotal}>
              <div className={styles.orderTotalName}>Выполнено за все время:</div>
              <div className={styles.orderTotalAmount}>{total}</div>
            </div>
            <div className={styles.orderTotal}>
              <div className={styles.orderTotalName}>Выполнено за сегодня:</div>
              <div className={styles.orderTotalAmount}>{totalToday}</div>
            </div>
          </div>

        </div>
      </>
  )
}