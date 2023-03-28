import login from '../styles/Login.module.css'
import React, { useRef, useId, useState } from 'react';
import { parseString } from "xml2js";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faCircleCheck, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

function Login() {

    const router = useRouter();

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

        fetch(`https://university6y.kanbanize.com/index.php/api/kanbanize/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: formData,
        })
        .then((response) => response.text())
        .then((data) => {
            parseString(data, { explicitArray: false }, function(error, result) {
                localStorage.setItem('email', result.xml.email);
                localStorage.setItem('apikey', result.xml.apikey);
                router.push('/myBoards');
            });
        })
        .catch((error) => {
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