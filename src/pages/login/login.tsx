import {Button, Input, PasswordInput} from "@ya.praktikum/react-developer-burger-ui-components";
import {useCallback, useState} from "react";
import {Link, Navigate, useLocation} from "react-router-dom";
import {RouteState} from "../../components/protected-route/protected-route";
import {useDispatch, useSelector} from "react-redux";
import {AuthState, loginUserThunk} from "../../services/reducers/auth";
import {RootState} from "../../services/store";

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const location = useLocation();
    const state = location.state as RouteState;
    const {loginFailed, loginStarted, loginSuccess} = useSelector<RootState, AuthState>(state => state.auth);

    let from = state?.from?.pathname || "/";

    const onSubmit = useCallback((event) => {
        event.preventDefault();
        dispatch(loginUserThunk({email, password}));
    }, [email, password, dispatch]);

    if (loginSuccess) {
        console.log('NAVIGATE', from, state);
        return <Navigate to={from} replace={true} />
    }

    return (
        <div className='centered-container'>

            <form className='formContainer' onSubmit={onSubmit}>
                <h1 className={'text text_type_main-medium'}>Вход</h1>
                <Input
                    type={'email'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='E-mail'
                />
                <PasswordInput
                    value={password}
                    name={'пароль'}
                    size={'default'}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {loginFailed && <div>Неверный логин или пароль</div>}
                <Button type={'primary'} disabled={loginStarted} htmlType='submit'>Войти</Button>

                <div className='formFooter'>
                    <nav className='text text_type_main-default mt-20 mb-4'>
                        Вы новый пользователь?&nbsp;
                        <Link className='navLink' to={'/register'}>Зарегистрироваться</Link>
                    </nav>
                    <nav className='text text_type_main-default'>
                        Забыли пароль?&nbsp;
                        <Link className='navLink' to={'/forgot-password'}>Восстановить пароль</Link></nav>
                </div>
            </form>
        </div>
    )
}
