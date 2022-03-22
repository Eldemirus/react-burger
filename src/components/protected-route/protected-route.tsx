import {Navigate, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../services/store";
import {AuthState} from "../../services/reducers/auth";

export interface RouteState {
    from: {
        pathname: string;
    };
}

export function ProtectedRoute({authorized, children}: {authorized: boolean, children: JSX.Element}) {
    const {user} = useSelector<RootState, AuthState>(state => state.auth);
    let location = useLocation();
    const state = location.state as RouteState;

    if (!user && authorized) {
        let from = state?.from?.pathname || "/login";
        console.log('PROTECT', authorized, `to ${from}`, location.pathname)
        return <Navigate to={from} state={{from: location}} replace/>;
    }

    if (user && !authorized) {
        let from = state?.from?.pathname || "/profile";
        console.log('PROTECT', authorized, `to ${from}`, location.pathname)
        return <Navigate to={from} replace/>;
    }

    return (
        children
    );
}