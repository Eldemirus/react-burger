import React, {FC, useEffect, useMemo} from "react";
import styles from "./order-info.module.css";
import {statusMap} from "../../components/common/order";
import {useDispatch, useSelector} from "../../services/store";
import {Ingredient} from "../../components/common/ingredient";
import {useLocation, useMatch} from "react-router-dom";
import Price from "../../components/price/price";
import {dateFormat} from "../../utils/date-format";
import {wsConnect, wsDisconnect} from "../../services/actions/ws-actions";


type IngredientLineProps = {
  ingredient: Ingredient;
  amount: number;
}

export const IngredientLine: FC<IngredientLineProps> = ({ingredient, amount}) => {
  return (
      <div className={styles.ingredientLineContainer}>

        <div className={styles.ingredientImageBorder}>
          <div className={styles.ingredientImageContainer}>
            <img src={ingredient.image} alt={ingredient.name}
                 className={styles.ingredientImage}/>
          </div>
        </div>
        <div className={styles.ingredientName}>
          {ingredient.name}
        </div>
        <div className={styles.ingredientAmount}>
          {amount}&nbsp;x&nbsp;<Price value={ingredient.price}/>
        </div>

      </div>
  )
}


const OrderInfo: React.FC = () => {
  const match = useMatch('/feed/:id');
  const matchProfile = useMatch('/profile/orders/:id');
  const location = useLocation();
  const dispatch = useDispatch();
  const {orders, ordersLoading, ordersFailed} = useSelector(state => state.orderList);
  const {token} = useSelector(state => state.auth);
  const state = location.state as { background: Location }

  const modeProfile = useMemo(() => {
    return matchProfile !== null;
  }, [matchProfile])

  const orderId = modeProfile ? matchProfile?.params.id : match?.params.id;
  const order = useMemo(() => orders.find(order => order._id === orderId), [orders, orderId]);

  const {ingredients} = useSelector(state => state.ingredients);
  const orderIngredients = useMemo(() => {
    return order?.ingredients?.map(id => {
          return ingredients.find(ingredient => ingredient._id === id);
        })
        .reduce((a,b) => {
          const v = a.find(c => c._id === b?._id);
          if (v) {
            v.amount = v.amount ? v.amount + 1 : 2;
          } else {
            if (b) {
              a.push({...b, amount: 1});
            }
          }
          return a;
        }, [] as Array<Ingredient>) ?? [] as Array<Ingredient>;
  }, [ingredients, order]);

  useEffect(() => {
    if (!state?.background) {
      if (modeProfile) {
        if (token) {
          dispatch(wsConnect(`orders?token=${token}`));
        }
      } else {
        dispatch(wsConnect('orders/all'));
      }
      return () => {
        dispatch(wsDisconnect())
      }
    }
  }, [dispatch, state, token])

  const total = useMemo(() =>
          orderIngredients
              .map(ingredient => ingredient?.price * ingredient?.amount ?? 0)
              .reduce((a, b) => a + b, 0)
      , [orderIngredients]);

  const status = useMemo(() => order?.status ? statusMap.get(order.status) : '???? ??????????????????', [order])

  if (ordersLoading) {
    return (
        <>????????????????</>
    )
  }
  if (ordersFailed || !order) {
    return (
        <>???????????? ???????????????? ????????????</>
    )
  }

  return (
      <>
        <div className={state?.background ? styles.popupContainer : styles.pageContainer}>
          <div className={styles.container}>
            <div className={state?.background ? styles.orderIdPopup : styles.orderId }>#{order?.number}</div>
            <div className={styles.orderName}>{order?.name}</div>
            <div className={order.status === 'done' ? styles.orderStatusDone : styles.orderStatus}>{status}</div>

            <div className={styles.ingredientsCaption}>????????????:</div>
            <div className={styles.ingredientsContainer}>
              {orderIngredients.map(ingredient => (
                  ingredient && <IngredientLine ingredient={ingredient} amount={ingredient.amount ?? 1} key={ingredient._id}/>
              ))}
            </div>
            <div className={styles.footerLine}>
              <div className={styles.dateText}>{dateFormat(order.updatedAt??'')}</div>
              <div><Price value={total}/></div>
            </div>
          </div>
        </div>
      </>
  )
}

export default OrderInfo;