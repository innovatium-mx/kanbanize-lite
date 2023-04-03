import login from '../styles/Login.module.css'
import React, { useRef, useId, useState } from 'react';
import { parseString } from "xml2js";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import {urlLocal} from '../constants.ts'
import dynamic from 'next/dynamic';
import '../src/i18next.tsx';


function Login(){

    const router = useRouter();
    const Kb_logo = require('../images/Kanbanize_logo.png')
    const LanguageButton = dynamic(import('../components/LanguageDropdown'), {ssr:false});
    
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

        fetch(urlLocal + '/login', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: formData,
        })
        .then((response) => response.json())
        .then((data) => {
            if(!data.response){
                localStorage.setItem('email', data.email);
                localStorage.setItem('apikey', data.apikey);
                router.push('/myBoards');
            }

        })
        .catch((error) => {
            console.log(error);
          });

    };


    return (
        <>
        <div>
            
            <div className={login.dropdownFragment}>
                <LanguageButton></LanguageButton>
            </div>

            <div className={login.grid}>

                <div >
                    <Image src={Kb_logo} alt="Kanbanize-logo" className={login.logo}/>
                </div>

                <form className={login.form} onSubmit={handleSubmit}>

                        <div className={login.formHeader}>
                            <b>
                                <span className={login.loginText} id="login.LogIn">Log In</span>
                            </b>
                            </div>

                        <div>
                            <span id="login.donothaveaccount">Don't have an account? </span>
                            <a href="https://kanbanize.com/sign-up" className={login.linkStyle} id="login.register">Register</a>
                        </div>

                        <br />

                    <fieldset className={login.formGroup}>

                        <div className={login.formInputLogin}>
                            <input type="email" className={login.inputLogin}  name="Email" placeholder="Email" title="Enter your email" onChange={handleLoginEmail}></input>
                        </div>

                    </fieldset>

                    <fieldset className={login.formGroup}>

                        <div className={login.formInputLogin}>
                            <input type="password" className={login.inputLogin} name="Password" placeholder="Password" title="Enter your password" onChange={handleLoginPassword} ></input>
                        </div>

                    </fieldset>

                    <footer className={login.formFooterLogin}>
                        <button className={login.formBtnSubmitLogin} type="submit" id="login.LogIn">Log In</button>
                    </footer>

                    </form>
                </div>
            </div>
        </>

    )
}

export default (Login);