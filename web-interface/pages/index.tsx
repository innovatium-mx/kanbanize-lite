import login from '../styles/Login.module.css'
import React, { useState } from 'react';
import { useRouter } from 'next/router'
import Image from "next/image";
import {urlCloud} from '../constants'
import dynamic from 'next/dynamic';
import Swal from 'sweetalert2'
const cookieCutter= require('cookie-cutter');

//i18next language imports
import { useTranslation, Trans, i18n } from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useEffect } from 'react';

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
    const invalidCompany = t('login.invalidCompany');
    const emptyCredentials = t('login.emptyFields');

    const LanguageButton = dynamic(import('../components/LanguageDropdown'), {ssr:false});

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginCompany, setLoginCompany] = useState('');

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

    const handleLoginCompany = (e: {
        target : {value: React.SetStateAction<string> };
    }) => {
        setLoginCompany(e.target.value);
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        
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

            // retrieve company name
            const company = t('login.company');
            const companyLookUp = t('login.companyLookUp')

            const {value: loginCompany} = await Swal.fire({
                title: company,
                input: 'text',
                inputAttributes: {
                  autocapitalize: 'off'
                },
                showCancelButton: false,
                confirmButtonText: companyLookUp,
                confirmButtonColor: '#42AD49',
                showLoaderOnConfirm: true,
                preConfirm: (loginCompany) => {
                  return loginCompany;
                },
                allowOutsideClick: () => !Swal.isLoading()
              })

              // end-retrieve company name


            let formData : string = JSON.stringify({
                "email": loginEmail,
                "pass": loginPassword,
            });

            fetch(urlCloud + 'login/' + loginCompany, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: formData,
            })
            .then((response) => response.json())
            .then((data) => {
                if(data.apikey){
                    // Set a cookie
                    const now = new Date();
	                cookieCutter.set('apikey', data.apikey, { expires: new Date(now.getTime() + 24 * 60 * 60 * 1000 * 7)});
                    cookieCutter.set('host', loginCompany, { expires: new Date(now.getTime() + 24 * 60 * 60 * 1000 * 7)});
                    cookieCutter.set('email', data.email, { expires: new Date(now.getTime() + 24 * 60 * 60 * 1000 * 7)});
                    cookieCutter.set('userid', data.userid, { expires: new Date(now.getTime() + 24 * 60 * 60 * 1000 * 7)});
                    cookieCutter.set('avatar',  data.avatar === null ? "" : data.avatar, { expires: new Date(now.getTime() + 24 * 60 * 60 * 1000 * 7)});
                    cookieCutter.set('username', data.username, { expires: new Date(now.getTime() + 24 * 60 * 60 * 1000 * 7)});

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
    
                    router.replace({pathname: 'dashboard'});
                    /////////////
    
                }else{
                    // login failed
                    //[data.error] exists when invalid companyname, otherwise, undefined
                    var whichInvalid = '';

                    if(data.error == 403){
                        whichInvalid = invalidCompany;
                    }else{
                        whichInvalid = invalid;
                    }
                    Swal.fire({
                        iconColor: 'red',
                        confirmButtonColor: 'gray',
                        icon: 'error',
                        title: whichInvalid
                    })

                }
    
            })
            .catch((error) => {
                console.log(error);
              });
        }



    };

    useEffect(() => {
      const checkToken = () => {
        const token = cookieCutter.get('apikey');
        if (token) 
        {
          router.replace({pathname: 'dashboard'});
        } 
      }
      checkToken();
    });


    return (
        <>
        <div className={login.index}>

        {
            /* <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            </Head>*/
        }
            <div className={login.dropdownFragment}>
                <LanguageButton color={false}/>
            </div>


        <div>

            <div className={login.grid}>

                <div >
                    <img src="/Kanbanize_logo.png" alt="Kanbanize-logo" className={login.logo}/>
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