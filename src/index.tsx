import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/app/app';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import store from "./services/store";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {MainPage} from "./components/main-page/main-page";
import {PageNotFound} from "./components/page-not-found/page-not-found";
import {Login} from "./components/login/login";
import {Register} from "./components/register/register";
import {ResetPassword} from "./components/reset-password/reset-password";
import {ForgotPassword} from "./components/forgot-password/forgot-password";
import {Profile} from "./components/profile/profile";
import {ProfileEdit} from "./components/profile/profile-edit";
import {ProtectedRoute} from "./components/protected-route/protected-route";

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App/>}>
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
                               element={<MainPage/>}/>
                        <Route path="profile" element={<ProtectedRoute authorized={true}><Profile/></ProtectedRoute>}>
                            <Route index element={<ProfileEdit/>}/>
                            <Route path="orders" element={<PageNotFound/>}/>
                            <Route path="orders/:id" element={<PageNotFound/>}/>
                        </Route>
                        <Route path="*" element={<PageNotFound/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
