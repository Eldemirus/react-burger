import { CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import priceStyle from './price.module.css';

const Price: React.FC<{
    value: number;
    className?: string;
    size?: string;
}> = ({value = 0, className= '', size = 'default'}) => {
    return (
        <div className={className + ' ' + priceStyle.priceContainer}>
            <span className={"pr-2 text text_type_digits-" + size}>{value}</span>
            <CurrencyIcon type="primary" />
        </div>
    )
}

export default Price;