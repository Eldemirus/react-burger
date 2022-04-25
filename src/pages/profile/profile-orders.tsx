import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "../../services/store";
import {OrderPreview} from "../../components/order-preview/order-preview";
import styles from './profile.module.css';
import {clearOrderList} from "../../services/reducers/order-list";
import {useLocation, useNavigate} from "react-router-dom";
import {Order} from "../../components/common/order";

export const ProfileOrders = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const {orders, ordersLoading, ordersFailed} = useSelector(state => state.orderList);
  const {token} = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(clearOrderList());
    dispatch({type: 'WS_CONNECTION_START', payload: `orders?token=${token}`})
    return () => {
      dispatch({type: 'WS_CONNECTION_STOP'})
    }
  }, [dispatch, token])

  const onClick = useCallback((order: Order) => {
    navigate(`/profile/orders/${order._id}`, {state: {background: location}});
  }, [navigate, location]);

  if (ordersFailed) {
    return (<div>Ошибка при загрузке заказов</div>);
  }
  if (ordersLoading) {
    return (<div>выполняется загрузка</div>);
  }

  return (
      <div className={styles.feedContainer}>
        {orders.length === 0 ? <div>Отсутствует информация о заказах</div> :
            (orders.map(order => (
                <OrderPreview order={order} key={order._id} showStatus={true} onClick={onClick}/>
            )))
        }
      </div>
  );

}
