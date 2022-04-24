import {FC, useMemo} from "react";
import styles from './order-preview.module.css';
import {Order, statusMap} from "../common/order";
import Price from "../price/price";
import {Ingredient} from "../common/ingredient";
import {useSelector} from "react-redux";
import {RootState} from "../../services/store";
import {IngredientsState} from "../../services/reducers/ingredients";

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
          {counter &&
              <div className={styles.ingredientCounter}>+{counter}</div>
          }
        </div>
      </div>
  )
}

type OrderPreviewProps = {
  order: Order;
  showStatus?: boolean;
}

export const OrderPreview: FC<OrderPreviewProps> = ({order, showStatus = false}) => {

  const {
    ingredients,
  } = useSelector<RootState, IngredientsState>(state => state.ingredients);

  const orderIngredients = useMemo(() => {
    return order.ingredients?.map(id => {
      return ingredients.find(ingredient => ingredient._id === id);
    }) ?? [] as Array<Ingredient>;
  }, [ingredients, order.ingredients]);


  const total = useMemo(() => orderIngredients.map(ingredient => ingredient?.price ?? 0).reduce((a, b) => a + b), [orderIngredients]);
  const status = useMemo(() => order.status ? statusMap.get(order.status) : 'не определен', [order])

  const otherIngredients = orderIngredients.splice(6);

  return (
      <div className={styles.orderContainer}>
        <div className={styles.headerLine}>
          <div className={styles.orderNumber}>#{order.number}</div>
          <div className={styles.orderTime}>{order.updatedAt}</div>
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
                  <div className={styles.ingredientBox} style={{zIndex: (100 - index)}} key={ingredient._id + index}>
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