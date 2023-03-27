import axios from "axios";
import login from '../styles/Login.module.css'
import React, { useRef, useId, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faCircleCheck, faTimesCircle } from '@fortawesome/free-solid-svg-icons';



function Login() {

    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');


    function handleSubmit(){
        /*axios({
            method: "post",
            headers: {"Content-type" : "application/json"},
            data: {
                email : loginUsername,
                pass : loginPassword
            },
            withCredentials: true,
            url: "https://university6y.kanbanize.com/index.php/api/kanbanize/login"
        }).then(res=> console.log(res)).catch(err=> console.log(err));
        */

        axios.post(`https://university6y.kanbanize.com/index.php/api/kanbanize/login`,{
            data : {
                email : loginUsername,
                pass : loginPassword
            }
        })
        .then(res=> console.log(res)).catch(err=> console.log(err));
    };

    return (
        <>
        <div className={login.grid}>
            <header className="login.header">
                <h1>Login</h1>
            </header>

            <form className={login.form}>

                <fieldset className={login.formGroup}>

                    <div className={login.formInputLogin}>
                        <input type="email" className={login.inputLogin}  name="username" placeholder="username" title="Enter your email" onChange={e => setLoginUsername(e.target.value)}></input>
                    </div>

                </fieldset>

                <fieldset className={login.formGroup}>

                    <div className={login.formInputLogin}>
                        <input type="password" className={login.inputLogin} name="passwrd" placeholder="password" title="Enter your password"  onChange={e => setLoginPassword(e.target.value)}></input>
                    </div>

                </fieldset>

                <footer className={login.formFooterLogin}>
                    <button className={login.formBtnSubmitLogin} type="submit" onClick={() => handleSubmit()}>Login</button>
                </footer>

            </form>



        </div>
        </>
    )
}

export default Login;