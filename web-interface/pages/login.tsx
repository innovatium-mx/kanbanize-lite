import login from '../styles/Login.module.css'
import React, { useRef, useId, useState } from 'react';
import { parseString } from "xml2js";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import {urlLocal} from '../constants.ts'
import dynamic from 'next/dynamic';

//i18next language imports
import { useTranslation, Trans } from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';

import type { GetStaticProps, InferGetStaticPropsType } from 'next'

type Props = {
    // Add custom props here
  }

const Login= (_props: InferGetStaticPropsType<typeof getStaticProps>) =>{

    //
    const {t} = useTranslation('common');
    const router = useRouter();

    const passwordInput = t('common.password' as const)
    const emailInput = t('common.email' as const)


    //

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
                <LanguageButton/>
            </div>

            <div className={login.grid}>

                <div >
                    <Image src={Kb_logo} alt="Kanbanize-logo" className={login.logo}/>
                </div>

                <form className={login.form} onSubmit={handleSubmit}>

                        <div className={login.formHeader}>
                            <b>
                                <span className={login.loginText}>
                                        {t('login.LogIn')}
                                </span>
                            </b>
                            </div>

                        <div>
                            <span>{t('login.donothaveaccount')}</span>
                            <a href="https://kanbanize.com/sign-up" className={login.linkStyle} >{t('login.register')}</a>
                        </div>

                        <br />

                    <fieldset className={login.formGroup}>

                        <div className={login.formInputLogin}>
                            <input type="email" className={login.inputLogin}  name="Email" placeholder={t('login.email' as const)} title="Enter your email" onChange={handleLoginEmail}></input>
                        </div>

                    </fieldset>

                    <fieldset className={login.formGroup}>

                        <div className={login.formInputLogin}>
                            <input type="password" className={login.inputLogin} name = 'password' placeholder={t('login.password' as const)} title="Enter your password" onChange={handleLoginPassword} ></input>
                        </div>

                    </fieldset>

                    <footer className={login.formFooterLogin}>
                        <button className={login.formBtnSubmitLogin} type="submit">{t('login.LogIn')}</button>
                    </footer>

                    </form>
                </div>
            </div>
        </>

    )
}


// or getServerSideProps: GetServerSideProps<Props> = async ({ locale })
export const getStaticProps: GetStaticProps<Props> = async ({
    locale,
  }) => ({
    props: {
      ...(await serverSideTranslations(locale ?? 'en', [
        'common'
      ])),
    },
  })

export default (Login);