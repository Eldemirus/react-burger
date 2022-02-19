import {BurgerIcon, ListIcon, Logo, ProfileIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import headerStyles from './app-header.module.css';


const NavigationLink: React.FC<{
    title: string;
    enabled?: boolean;
    url?: string;
}> = ({url = '', title, enabled = true, children}) => {
    return (
        <div className={headerStyles.navItem}>
            {children}
            <span className={"pl-4 text text_type_main-small " + (!enabled && "text_color_inactive")}>{title}</span>
        </div>
    )
}

function NavigaionBar() {
    return (
        <div className={headerStyles.navBar}>
            <NavigationLink title="Конструктор" url="">
                <BurgerIcon type="primary"/>
            </NavigationLink>
            <NavigationLink title="Лента заказов" url="" enabled={false}>
                <ListIcon type="primary"/>
            </NavigationLink>
        </div>
    )
}


function AppHeader() {
    return (
        <header className={headerStyles.header}>
            <div className={headerStyles.headerItemFirst}>
                <NavigaionBar/>
            </div>
            <div className={headerStyles.headerItem}>
                <Logo/>
            </div>
            <div className={headerStyles.headerItemLast}>
                <NavigationLink title="Личный кабинет">
                    <ProfileIcon type="primary"/>
                </NavigationLink>
            </div>
        </header>
    );
}

export default AppHeader;