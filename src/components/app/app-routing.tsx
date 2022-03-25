import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {MainPage} from "../../pages/main-page/main-page";
import {ProtectedRoute} from "../protected-route/protected-route";
import {Login} from "../../pages/login/login";
import {Register} from "../../pages/register/register";
import {ForgotPassword} from "../../pages/forgot-password/forgot-password";
import {ResetPassword} from "../../pages/reset-password/reset-password";
import {Profile} from "../../pages/profile/profile";
import {ProfileEdit} from "../../pages/profile/profile-edit";
import {PageNotFound} from "../../pages/page-not-found/page-not-found";
import React, {useCallback} from "react";
import Modal from "../modal/modal";
import IngredientDetails from "../../pages/ingredient-details/ingredient-details";

export const AppRouting = () => {
    const location = useLocation();
    const state = location.state as {background: Location}
    const navigate = useNavigate();

    const hideIngredientDetails = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    return (
        <>
            <Routes location={state?.background || location}>
                <Route index element={<MainPage/>}/>
                <Route path="login"
                       element={<ProtectedRoute authorized={false}><Login/></ProtectedRoute>}/>
                <Route path="register"
                       element={<ProtectedRoute authorized={false}><Register/></ProtectedRoute>}/>
                <Route path="forgot-password"
                       element={<ProtectedRoute authorized={false}><ForgotPassword/></ProtectedRoute>}/>
                <Route path="reset-password"
                       element={<ProtectedRoute authorized={false}><ResetPassword/></ProtectedRoute>}/>
                <Route path="ingredient/:id"
                       element={<IngredientDetails/>}/>
                <Route path="profile" element={<ProtectedRoute authorized={true}><Profile/></ProtectedRoute>}>
                    <Route index element={<ProfileEdit/>}/>
                    <Route path="orders" element={<PageNotFound/>}/>
                    <Route path="orders/:id" element={<PageNotFound/>}/>
                </Route>
                <Route path="*" element={<PageNotFound/>}/>
            </Routes>
            {state?.background && (
                <Modal handleClose={hideIngredientDetails} title={'Детали ингредиента'}>
                    <IngredientDetails/>
                </Modal>
            )}
        </>
    )
}