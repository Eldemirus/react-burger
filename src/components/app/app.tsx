import React, {useEffect} from 'react';
import AppHeader from "../app-header/app-header";
import ErrorBoundary from "../error-boundary/error-boundary";
import {BrowserRouter} from "react-router-dom";
import {useDispatch} from "../../services/store";
import {loadIngredients} from "../../services/reducers/ingredients";
import {getUserThunk} from "../../services/reducers/auth";
import {AppRouting} from "./app-routing";

function App() {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadIngredients());
        dispatch(getUserThunk())
    }, [dispatch])

    return (
        <>
            <BrowserRouter>
                <AppHeader/>
                <ErrorBoundary>
                    <AppRouting/>
                </ErrorBoundary>
            </BrowserRouter>
        </>
    );
}

export default App;
