import { useTranslation, Trans } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetServerSideProps, InferGetServerSidePropsType} from 'next'
import {useEffect, useState } from "react";
import authRoute from '../components/authRoute';
import dynamic from 'next/dynamic';
import {urlCloud} from '../constants'
import { useRouter } from "next/router";
import Cookies from 'cookies'

type Props = {

}

interface Data {workspace_id: string,
  type: string,
  is_archived: string,
  name: string}

  type NextJsI18NConfig = {
    defaultLocale: string
    domains?: {
      defaultLocale: string
      domain: string
      http?: true
      locales?: string[]
    }[]
    localeDetection?: false
    locales: string[]
  }

  interface PropsResponse {
    data : Array<Data>
    _nextI18Next : NextJsI18NConfig
  }

const MyBoards = ( props: PropsResponse) => {
    const [value, setValue] = useState(0);
    const {t} = useTranslation('common');
    const LanguageButton = dynamic(import('../components/LanguageDropdown'), {ssr:false});

    const handleChange = (event : any) => {
      setValue(event.target.value);
      console.log(event.target.value);
    };
    console.log(props.data[0]);

    return (
        <>
        <div>
            <LanguageButton/>
            <h1>{t("myBoards.myBoards")}</h1>
            <select value={value} onChange={handleChange} >
                <option value="" disabled selected hidden>WorkSpaces</option>
                {Object.entries(props.data).map(([key, { name,workspace_id}])  => (
                  <option value={workspace_id}>{name}</option>
                ))}
				    </select>
            
        </div>
        </>
    )
}

// or getServerSideProps: GetServerSideProps<Props> = async ({ locale })
/*export const getStaticProps: GetStaticProps<Props> = async ({locale,}) => ({
    
  })*/

  // This gets called on every request
  export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res, locale }) => {
    const cookies = new Cookies(req, res)
    const apikey : any = cookies.get('apikey');
    const host = cookies.get('host');
    const response = await  fetch(urlCloud+`workSpaces/${host}`, {
            method: "GET",
            headers: {
                "apikey": apikey
            },
    })
    
    if(response.ok){
      const data: any = await response.json();
      if(!data.error){
        return {
          props: {
            ...(await serverSideTranslations(locale ?? 'en', [
              'common'
            ])),
            data}
        }
      }
      else{
        cookies.set('apikey');
        cookies.set('host');
        cookies.set('email');
        cookies.set('userid');

        return {
          redirect: {
            permanent: false,
            destination: "/",
          },
          props: {
            ...(await serverSideTranslations(locale ?? 'en', [
              'common'
            ]))}
        }
      }
      
    }
    else{
      cookies.set('apikey');
      cookies.set('host');
      cookies.set('email');
      cookies.set('userid');

      return {
        redirect: {
          permanent: false,
          destination: "/",
        },
        props: {
          ...(await serverSideTranslations(locale ?? 'en', [
            'common'
          ]))}
      }
    }
    
  }
export default authRoute(MyBoards);