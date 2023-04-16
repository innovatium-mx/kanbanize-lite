import { useTranslation, Trans } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetServerSideProps, InferGetServerSidePropsType} from 'next'
import {useEffect, useState } from "react";
import authRoute from '../components/authRoute';
import dynamic from 'next/dynamic';
import {urlCloud} from '../constants'
import { useRouter } from "next/router";

type Props = {
    // Add custom props here
}

const MyBoards = ( props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [value, setValue] = useState(0);
    const {t} = useTranslation('common');
    const LanguageButton = dynamic(import('../components/LanguageDropdown'), {ssr:false});

    const handleChange = (event : any) => {
      setValue(event.target.value);
      console.log(event.target.value);
    };

    return (
        <>
        <div>
            <LanguageButton/>
            <h1>{t("myBoards.myBoards")}</h1>
            <select value={value} onChange={handleChange} >
                <option value={1}>Training</option>
				    </select>
            
        </div>
        </>
    )
}

// or getServerSideProps: GetServerSideProps<Props> = async ({ locale })
/*export const getStaticProps: GetStaticProps<Props> = async ({locale,}) => ({
    
  })*/

  // This gets called on every request
export const getServerSideProps: GetServerSideProps<Props> = async ({locale}) => ({
    //const cookies = request.cookies.get('myCookieName')?.value;
    props: {
      ...(await serverSideTranslations(locale ?? 'en', [
        'common'
      ])),
    }
}) 
export default authRoute(MyBoards);