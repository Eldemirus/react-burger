import {PageNotFound} from "../page-not-found/page-not-found";
import IngredientDetails from "../ingredient-details/ingredient-details";
import styles from './ingredient-details-page.module.css';
import {Ingredient} from "../common/ingredient";

export const IngredientDetailsPage = ({ingredient}: {ingredient: Ingredient}) => {

    if (!ingredient) {
        return <PageNotFound/>;
    }

    return (
        <div className={styles.detailsContainer}>
            <div className={'text text_type_main-large'}>Детали ингредиента</div>
            <IngredientDetails ingredient={ingredient} />
        </div>
    )
}