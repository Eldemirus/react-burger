import {Button, Input, PasswordInput} from "@ya.praktikum/react-developer-burger-ui-components";
import {useCallback, useState} from "react";
import {Link} from "react-router-dom";
import {registerUser} from "../../utils/api-user";

export const Register = () => {


    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = useCallback((event) => {
        event.preventDefault();
        registerUser(email, password, name)
            .then(message => {
                console.log('registered', message);
            })
            .catch(error => console.log('error', error));
    }, [email, password, name]);
    return (
        <div className='centered-container'>

            <form className='formContainer' onSubmit={onSubmit}>
                <h1 className={'text text_type_main-medium'}>Регистрация</h1>
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
                <Button type={'primary'} htmlType='submit'>Зарегистрироваться</Button>

                <div className='formFooter'>
                    <nav className='text text_type_main-default mt-20 mb-4'>
                        Вы новый пользователь?&nbsp;
                        <Link className='navLink' to={'/login'}>Войти</Link>
                    </nav>
                </div>
            </form>
        </div>
    )
}
