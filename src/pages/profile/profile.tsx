import {NavLink, Outlet} from "react-router-dom";
import styles from './profile.module.css';
import {useDispatch} from "../../services/store";
import {logoutUserThunk} from "../../services/reducers/auth";
import React from "react";


export const Profile = () => {
    const dispatch = useDispatch();

    const onLogoutClick = () => {
        dispatch(logoutUserThunk())
    }

    return (
        <div className={styles.container}>
            <nav className={styles.navProfile}>
                <NavLink
                    className={({isActive}) => isActive ? styles.navLinkProfileActive : styles.navLinkProfile}
                    to={'/profile/'}
                >
                    Профиль
                </NavLink>
                <NavLink
                    className={({isActive}) => isActive ? styles.navLinkProfileActive : styles.navLinkProfile}
                    to={'/profile/orders'}
                >
                    История заказов
                </NavLink>
                <span
                    className={styles.navLinkProfile}
                    onClick={onLogoutClick}
                >
                    Выход
                </span>
            </nav>
            <div className={styles.profileContent}>
                <Outlet />
            </div>
        </div>
    )
}