import login from '../styles/Login.module.css'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import {urlLocal} from '../constants'
import dynamic from 'next/dynamic';
import Swal from 'sweetalert2'

//i18next language imports
import { useTranslation, Trans, i18n } from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';

import type { GetStaticProps, InferGetStaticPropsType } from 'next';

type Props = {
    // Add custom props here
  }

const Login= (_props: InferGetStaticPropsType<typeof getStaticProps>) =>{

    //
    const {t} : any = useTranslation('common');
    const router = useRouter();

    const passwordInput = t('common.password' as const)
    const emailInput = t('common.email' as const)

    const invalid = t('login.invalid');
    const emptyCredentials = t('login.emptyFields');

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
        let formData : string = JSON.stringify({
            "email": loginEmail,
            "pass": loginPassword,
        });

        fetch(urlLocal + '/login/university6y', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: formData,
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.apikey){
                localStorage.setItem('email', data.email);
                localStorage.setItem('apikey', data.apikey);
                localStorage.setItem('userid', data.userid);
                router.push('/myBoards');
            }

        })
        .catch((error) => {
            console.log(error);
          });
        
        // empty fields

        if(loginEmail === "" || loginPassword === ""){
            Swal.fire({
                iconColor: 'red',
                confirmButtonColor: 'gray',
                icon: 'error',
                title: emptyCredentials
            })
        }
        else{

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
                    console.log(data);
    
                    localStorage.setItem('email', data.email);
                    localStorage.setItem('apikey', data.apikey);
                    
                    //login successfull
                    const signedInSuccess = t('login.success')
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: false,
                        didOpen: (toast) => {
                          toast.addEventListener('mouseenter', Swal.stopTimer)
                          toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                      })
                      
                      Toast.fire({
                        icon: 'success',
                        title: signedInSuccess
                      })
    
                    router.push('/myBoards');    
    
                }else{
                    // login failed
                    Swal.fire({
                        iconColor: 'red',
                        confirmButtonColor: 'gray',
                        icon: 'error',
                        title: invalid
                    })
                }
    
            })
            .catch((error) => {
                console.log(error);
              });
        }
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

                <form className={login.form}>


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
                        <button className={login.formBtnSubmitLogin} type="submit" onClick={handleSubmit}>{t('login.LogIn')}</button>
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