import {Navigate, useLocation} from "react-router-dom";
import {useSelector} from "../../services/store";
import styles from "../../pages/page-not-found/page-not-found.module.css";
import React from "react";

export interface RouteState {
    from: {
        pathname: string;
    };
}

export function ProtectedRoute({authorized, children}: { authorized: boolean, children: JSX.Element }) {
    const {user, checkingUser} = useSelector(state => state.auth);
    let location = useLocation();
    const state = location.state as RouteState;

    if (checkingUser) {
        return (
            <div className={styles.errorText}>
                Загрузка пользователя
            </div>
        )
    }

    if (!user && authorized) {
        let from = state?.from?.pathname || "/login";
        return <Navigate to={from} state={{from: location}} replace/>;
    }

    if (user && !authorized) {
        let from = state?.from?.pathname || "/profile";
        return <Navigate to={from} replace/>;
    }

    return (
        children
    );
}