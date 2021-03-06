import {Button, Input, PasswordInput} from "@ya.praktikum/react-developer-burger-ui-components";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "../../services/store";
import styles from './profile.module.css';
import {updateUserThunk} from "../../services/reducers/user-profile";

export const ProfileEdit = () => {
    const {user} = useSelector(state => state.auth);
    const {
        savingUserFailed,
        savingUserStarted,
        savingUserSuccess
    } = useSelector(state => state.userProfile);
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        setEmail(user?.email ?? '');
        setName(user?.name ?? '');
    }, [user])

    const onSaveClick = useCallback((event) => {
        event.preventDefault();
        dispatch(updateUserThunk({email, name, password}))
    }, [dispatch, email, password, name]);

    const onCancelClick = () => {
        setEmail(user?.email ?? '');
        setName(user?.name ?? '');
        setPassword('');
    }

    const formChanged = useMemo(() => {
        return (email !== user?.email) || (name !== user.name) || (password !== '')
    }, [email, name, password, user])

    return (
        <div className=''>
            <form onSubmit={onSaveClick} className='formContainer'>
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

                {formChanged &&
                    <div className={styles.buttonLine}>
                        <Button type={'primary'} htmlType={'submit'} disabled={savingUserStarted}>Сохранить</Button>
                        <Button type={'secondary'} disabled={savingUserStarted}
                                onClick={onCancelClick}>Отменить</Button>
                    </div>
                }


            </form>
        </div>
    )
}
