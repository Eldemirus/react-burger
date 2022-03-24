import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {MainPage} from "../main-page/main-page";
import {ProtectedRoute} from "../protected-route/protected-route";
import {Login} from "../login/login";
import {Register} from "../register/register";
import {ForgotPassword} from "../forgot-password/forgot-password";
import {ResetPassword} from "../reset-password/reset-password";
import {Profile} from "../profile/profile";
import {ProfileEdit} from "../profile/profile-edit";
import {PageNotFound} from "../page-not-found/page-not-found";
import React, {useCallback} from "react";
import Modal from "../modal/modal";
import IngredientDetails from "../ingredient-details/ingredient-details";

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