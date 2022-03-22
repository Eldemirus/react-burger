import {BurgerIcon, ListIcon, Logo, ProfileIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from './app-header.module.css';
import {Link, NavLink, useMatch} from "react-router-dom";
import {FC} from "react";


interface NavigationLinkProps {
    title: string;
    url: string;
}

const NavigationLink: FC<NavigationLinkProps> = ({title, url, children}) => {
    return (
        <NavLink to={url} className={({isActive}) => isActive ? styles.navItemActive : styles.navItem}>
            {children}
            <span className={styles.linkText}>{title}</span>
        </NavLink>
    )
}

const NavigationBar = () => {
    return (
        <div className={styles.navBar}>
            <NavigationLink title="Конструктор" url="/">
                <BurgerIcon type="secondary"/>
            </NavigationLink>
            <NavigationLink title="Лента заказов" url="/feed">
                <ListIcon type="secondary"/>
            </NavigationLink>
        </div>
    )
}

const ProfileLink = () => {

    let match = useMatch("/profile/*");
    return (
        <Link className={ match ? styles.navItemActive : styles.navItem} to={'/profile/'}>
            <ProfileIcon type="secondary"/>
            <span className={styles.linkText}>Личный кабинет</span>
        </Link>
    );
}


function AppHeader() {
    return (
        <header className={styles.header}>
            <div className={styles.headerContainer}>
                <div className={styles.headerItemFirst}>
                    <NavigationBar/>
                </div>
                <div className={styles.headerItem}>
                    <Logo/>
                </div>
                <div className={styles.headerItemLast}>
                    <ProfileLink />
                </div>
            </div>
        </header>
    );
}

export default AppHeader;