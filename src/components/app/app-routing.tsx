import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {MainPage} from "../../pages/main-page/main-page";
import {ProtectedRoute} from "../protected-route/protected-route";
import {Login} from "../../pages/login/login";
import {Register} from "../../pages/register/register";
import {ForgotPassword} from "../../pages/forgot-password/forgot-password";
import {ResetPassword} from "../../pages/reset-password/reset-password";
import {Profile} from "../../pages/profile/profile";
import {ProfileEdit} from "../../pages/profile/profile-edit";
import React, {useCallback} from "react";
import Modal from "../modal/modal";
import IngredientDetails from "../../pages/ingredient-details/ingredient-details";
import {Feed} from "../../pages/feed/feed";
import {ProfileOrders} from "../../pages/profile/profile-orders";
import OrderInfo from "../../pages/order-info/order-info";

export const AppRouting = () => {
  const location = useLocation();
  const state = location.state as { background: Location }
  const navigate = useNavigate();

  const closePopup = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
      <>
        <Routes location={state?.background || location}>
          <Route index element={<MainPage/>}/>
          <Route path="feed" element={<Feed/>}/>
          <Route path="feed/:id" element={<OrderInfo/>}/>
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
            <Route path="orders" element={<ProfileOrders/>}/>
            <Route path="orders/:id" element={<OrderInfo/>}/>
          </Route>
        </Routes>
        {state?.background &&
            <Routes location={location}>
                <Route path="ingredient/:id" element={
                  <Modal handleClose={closePopup} title={'Детали ингредиента'}>
                    <IngredientDetails/>
                  </Modal>
                }/>
                <Route path="feed/:id" element={
                  <Modal handleClose={closePopup}>
                    <OrderInfo/>
                  </Modal>
                }/>
            </Routes>
        }
      </>
  )
}