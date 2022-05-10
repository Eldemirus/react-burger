import React, {FC, useCallback, useEffect, useMemo} from "react";
import styles from './feed.module.css';
import {OrderPreview} from "../../components/order-preview/order-preview";
import {Order} from "../../components/common/order";
import {useDispatch, useSelector} from "../../services/store";
import {clearOrderList} from "../../services/reducers/order-list";
import {useLocation, useNavigate} from "react-router-dom";
import {wsConnect, wsDisconnect} from "../../services/actions/ws-actions";


type OrderStatusListProps = { orders: Array<Order>, name: string }

const OrderStatusList: FC<OrderStatusListProps> = ({orders, name}) => {
  return (
      <div className={styles.orderStatusList}>
        <h1 className={styles.orderStatusListName}>{name}:</h1>
        <div className={styles.orderStatusListNumbers}>
          {orders.map(order => (
              <div key={order.number} className={styles.orderNumber}>{order.number}</div>
          ))}
        </div>
      </div>
  );
}

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const {orders, totalToday, total} = useSelector(state => state.orderList);

  useEffect(() => {
    dispatch(clearOrderList());
    dispatch(wsConnect('orders/all'))
    return () => {
      dispatch(wsDisconnect())
    }
  }, [dispatch])

  const ordersReady = useMemo(() => orders.filter(order => order.status === 'pending'), [orders]);
  const ordersWorking = useMemo(() => orders.filter(order => order.status === 'created'), [orders]);

  const onClick = useCallback((order: Order) => {
    navigate(`/feed/${order._id}`, {state: {background: location}});
  }, [navigate, location]);

  return (
      <>
        <div className={styles.main}>
          <div className={styles.headerContainer}>Лента заказов</div>
          <div className={styles.feedContainer}>
            {orders.map(order => (
                <OrderPreview order={order} key={order._id} onClick={onClick}/>
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