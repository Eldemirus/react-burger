import {Button, Input, PasswordInput} from "@ya.praktikum/react-developer-burger-ui-components";
import {useState} from "react";
import {Link} from "react-router-dom";

export const ProfileOrders = () => {


    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className='centered-container'>

            <div className='formContainer'>
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
                <Button type={'primary'}>Зарегистрироваться</Button>

                <div className='formFooter'>
                    <nav className='text text_type_main-default mt-20 mb-4'>
                        Вы новый пользователь?&nbsp;
                        <Link className='navLink' to={'/login'}>Войти</Link>
                    </nav>
                </div>
            </div>
        </div>
    )
}
