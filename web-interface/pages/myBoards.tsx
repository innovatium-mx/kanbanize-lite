import { useTranslation, Trans } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import authRoute from '../components/authRoute';
import { getStaticProps } from './login';

import dynamic from 'next/dynamic';


type Props = {
    // Add custom props here
}

const myBoards = ( _props: InferGetStaticPropsType<typeof getStaticProps>) => {
    const {t} = useTranslation('common');
    const LanguageButton = dynamic(import('../components/LanguageDropdown'), {ssr:false});


    return (
        <>
        <div>
            <LanguageButton/>
            <h1>{t("myBoards.myBoards")}</h1>
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

export default authRoute(myBoards);