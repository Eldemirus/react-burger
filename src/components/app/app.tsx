import React, {useEffect} from 'react';
import AppHeader from "../app-header/app-header";
import ErrorBoundary from "../error-boundary/error-boundary";
import "@ya.praktikum/react-developer-burger-ui-components/dist/ui/box.css";
import {Outlet} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {loadIngredients} from "../../services/reducers/ingredients";
import {AuthState, getUserThunk} from "../../services/reducers/auth";
import {RootState} from "../../services/store";
import styles from "../page-not-found/page-not-found.module.css";

function App() {

    const dispatch = useDispatch();
    const {checkingUser} = useSelector<RootState, AuthState>(state => state.auth);

    useEffect(() => {
        dispatch(loadIngredients());
        dispatch(getUserThunk())
    }, [dispatch])

    return (
        <>
            <AppHeader/>
            <ErrorBoundary>
                {checkingUser ? (
                    <div className={styles.errorText}>
                        Загрузка пользователя
                    </div>
                    ) : (
                        <Outlet/>
                    )
                }
            </ErrorBoundary>
        </>
    );
}

export default App;
