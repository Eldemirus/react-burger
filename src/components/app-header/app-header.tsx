import {BurgerIcon, ListIcon, Logo, ProfileIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import headerStyles from './app-header.module.css';


interface NavigationLinkProps {
    title: string;
    enabled?: boolean;
    url?: string;
}

const NavigationLink: React.FC<NavigationLinkProps> = ({title, enabled = true, children}) => {
    return (
        <a className={headerStyles.navItem}>
            {children}
            <span className={"pl-4 text text_type_main-default " + (!enabled && "text_color_inactive")}>{title}</span>
        </a>
    )
}

function NavigaionBar() {
    return (
        <div className={headerStyles.navBar}>
            <NavigationLink title="Конструктор" url="">
                <BurgerIcon type="primary"/>
            </NavigationLink>
            <NavigationLink title="Лента заказов" url="" enabled={false}>
                <ListIcon type="secondary"/>
            </NavigationLink>
        </div>
    )
}


function AppHeader() {
    return (
        <header className={headerStyles.header}>
            <div className={headerStyles.headerContainer}>
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
            </div>
        </header>
    );
}

export default AppHeader;