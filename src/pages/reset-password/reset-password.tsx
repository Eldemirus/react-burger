import {Button, Input, PasswordInput} from "@ya.praktikum/react-developer-burger-ui-components";
import {useCallback, useState} from "react";
import {Link, Navigate} from "react-router-dom";
import {useDispatch, useSelector} from "../../services/store";
import {passwordSaveThunk} from "../../services/reducers/restore-password";
import {loginUserThunk} from "../../services/reducers/auth";

export const ResetPassword = () => {
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');

    const {
        email,
        passwordSaveFailed,
        passwordSaveStarted,
        passwordSaveSuccess
    } = useSelector(state => state.restorePassword);
    const dispatch = useDispatch();
    const onSubmit = useCallback((event) => {
        event.preventDefault();
        dispatch(passwordSaveThunk({code, password}))
    }, [password, code, dispatch]);

    if (!email) {
        return (
            <Navigate to={'/forgot-password'} replace={true}/>
        )
    }
    if (passwordSaveSuccess) {
        dispatch(loginUserThunk({email, password}));
        return (
            <Navigate to={'/profile'}/>
        )
    }

    return (
        <div className='centered-container'>

            <form className='formContainer' onSubmit={onSubmit}>
                <h1 className={'text text_type_main-medium'}>Восстановление пароля</h1>
                <Input
                    type={'text'}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder='Код'
                />
                <PasswordInput
                    value={password}
                    name={'пароль'}
                    size={'default'}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {passwordSaveFailed && <div>Ошибка сохранения пароля</div>}
                {passwordSaveSuccess && <div>Пароль успешно изменен</div>}

                <Button type={'primary'} disabled={passwordSaveStarted} htmlType='submit'>Сохранить</Button>

                <div className='formFooter'>
                    <nav className='text text_type_main-default mt-20 mb-4'>
                        Вспомнили пароль?&nbsp;
                        <Link className='navLink' to={'/login'}>Войти</Link>
                    </nav>
                </div>
            </form>
        </div>
    )
}
