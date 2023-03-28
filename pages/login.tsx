import axios from "axios";
import login from '../styles/Login.module.css'
import React, { useRef, useId, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faCircleCheck, faTimesCircle } from '@fortawesome/free-solid-svg-icons';



function Login() {

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const handleLoginEmail = (e: {
        target: { value: React.SetStateAction<string> };
      }) => {
        setLoginEmail(e.target.value);
      };
    
    const handleLoginPassword = (e: {
        target: { value: React.SetStateAction<string> };
      }) => {
        setLoginPassword(e.target.value);
    };

    const handleSubmit = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        let formData : JSON = JSON.stringify({
            "email": loginEmail,
            "pass": loginPassword,
        });
        
        console.log(formData);
        axios.post(`https://university6y.kanbanize.com/index.php/api/kanbanize/login`,{
            body: formData,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function (response) {
            console.log('Cat');
            console.log(response);
            navigate('../');
        })
        .catch(function (error) {
            console.log('Dog')
            console.log(error);
        });

    };

    return (
        <>
        <div className={login.grid}>
            <header className="login.header">
                <h1>Login</h1>
            </header>

            <form className={login.form} onSubmit={handleSubmit}>

                <fieldset className={login.formGroup}>

                    <div className={login.formInputLogin}>
                        <input type="email" className={login.inputLogin}  name="username" placeholder="username" title="Enter your email" onChange={handleLoginEmail}></input>
                    </div>

                </fieldset>

                <fieldset className={login.formGroup}>

                    <div className={login.formInputLogin}>
                        <input type="password" className={login.inputLogin} name="password" placeholder="password" title="Enter your password" onChange={handleLoginPassword} ></input>
                    </div>

                </fieldset>

                <footer className={login.formFooterLogin}>
                    <button className={login.formBtnSubmitLogin} type="submit" >Login</button>
                </footer>

            </form>



        </div>
        </>
    )
}

export default Login;