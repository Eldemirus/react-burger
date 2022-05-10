import {FC, useCallback, useMemo} from "react";
import styles from './order-preview.module.css';
import {Order, statusMap} from "../common/order";
import Price from "../price/price";
import {Ingredient} from "../common/ingredient";
import {useSelector} from "../../services/store";
import {dateFormat} from "../../utils/date-format";

type IngredientPreviewProps = {
  ingredient: Ingredient;
  counter: number;
}

export const IngredientPreview: FC<IngredientPreviewProps> = ({ingredient, counter = 0}) => {
  return (
      <div className={styles.ingredientImageBorder}>
        <div className={styles.ingredientImageContainer}>
          <img src={ingredient.image} alt={ingredient.name}
               className={counter ? styles.ingredientImageLast : styles.ingredientImage}/>
          {counter > 0 &&
              <div className={styles.ingredientCounter}>+{counter}</div>
          }
        </div>
      </div>
  )
}

type OrderPreviewProps = {
  order: Order;
  showStatus?: boolean;
  onClick: (order: Order) => void;
}

export const OrderPreview: FC<OrderPreviewProps> = ({order, onClick, showStatus = false}) => {
  const {ingredients} = useSelector(state => state.ingredients);

  const orderIngredients = useMemo(() => {
    return order.ingredients?.map(id => {
      return ingredients.find(ingredient => ingredient._id === id);
    }) ?? [] as Array<Ingredient>;
  }, [ingredients, order.ingredients]);

  const total = useMemo(() => orderIngredients.map(ingredient => ingredient?.price ?? 0).reduce((a, b) => a + b), [orderIngredients]);
  const status = useMemo(() => order.status ? statusMap.get(order.status) : 'не определен', [order])

  const otherIngredients = useMemo(() => orderIngredients.splice(6), [orderIngredients]);

  const onClickOrder = useCallback(() => onClick(order), [order, onClick]);

  return (
      <div className={styles.orderContainer} onClick={onClickOrder}>
        <div className={styles.headerLine}>
          <div className={styles.orderNumber}>#{order.number}</div>
          <div className={styles.orderTime}>{dateFormat(order.updatedAt ?? '')}</div>
        </div>

        <div className={styles.orderName}>{order.name}</div>

        {showStatus &&
            <div className={order.status === 'done' ? styles.orderStatusDone : styles.orderStatus}>{status}</div>
        }
        <div className={styles.headerLine}>
          <div className={styles.orderIngredients}>
            {orderIngredients?.map((ingredient, index) => {
              return (
                  ingredient &&
                  <div className={styles.ingredientBox} style={{zIndex: (6 - index)}} key={ingredient._id + index}>
                      <IngredientPreview ingredient={ingredient}
                                         counter={index === orderIngredients.length - 1 ? otherIngredients.length : 0}/>
                  </div>
              )
            })}
          </div>
          <div className={styles.orderPrice}><Price value={total}/></div>
        </div>

      </div>
  )
}