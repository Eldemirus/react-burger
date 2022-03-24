import {Button, Input} from "@ya.praktikum/react-developer-burger-ui-components";
import {useCallback, useState} from "react";
import {Link, Navigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../services/store";
import {passwordEmailThunk, RestorePasswordState} from "../../services/reducers/restore-password";

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const {
        codeSentStarted,
        codeSentFailed,
        codeSentSuccess
    } = useSelector<RootState, RestorePasswordState>(state => state.restorePassword);
    const dispatch = useDispatch();


    const onSubmit = useCallback((event) => {
        event.preventDefault();
        dispatch(passwordEmailThunk({email}))
   }, [email, dispatch]);

    if (codeSentSuccess) {
        return (
            <Navigate to={'/reset-password'} />
        )
    }

    return (
        <div className='centered-container'>

            <form className='formContainer' onSubmit={onSubmit}>
                <h1 className={'text text_type_main-medium'}>Восстановление пароля</h1>
                <Input
                    type={'email'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='E-mail'
                />
                {codeSentFailed && <div>Ошибка сохранения</div>}
                <Button type={'primary'} disabled={codeSentStarted} htmlType='submit'>Восстановить</Button>

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
