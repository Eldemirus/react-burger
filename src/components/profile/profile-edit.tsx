import {Button, Input, PasswordInput} from "@ya.praktikum/react-developer-burger-ui-components";
import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../services/store";
import {AuthState} from "../../services/reducers/auth";
import styles from './profile.module.css';
import {updateUserThunk, UserProfileState} from "../../services/reducers/user-profile";

export const ProfileEdit = () => {
    const {user} = useSelector<RootState, AuthState>(state => state.auth);
    const {
        savingUserFailed,
        savingUserStarted,
        savingUserSuccess
    } = useSelector<RootState, UserProfileState>(state => state.userProfile);
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        setEmail(user?.email ?? '');
        setName(user?.name ?? '');
    }, [user])

    const onSaveClick = useCallback(() => {
        dispatch(updateUserThunk({email, name, password}))
    }, [dispatch, email, password, name]);

    const onCancelClick = () => {
        setEmail(user?.email ?? '');
        setName(user?.name ?? '');
        setPassword('');
    }


    return (
        <div className=''>

            <div className='formContainer'>
                <Input
                    type={'text'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Имя'
                />
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
                {savingUserSuccess && <div>Успешно сохранено</div>}
                {savingUserFailed && <div>Ошибка сохранения</div>}
                <div className={styles.buttonLine}>
                    <Button type={'primary'} disabled={savingUserStarted} onClick={onSaveClick}>Сохранить</Button>
                    <Button type={'secondary'} disabled={savingUserStarted} onClick={onCancelClick}>Отменить</Button>
                </div>


            </div>
        </div>
    )
}
