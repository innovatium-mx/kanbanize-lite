import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { appWithTranslation } from 'next-i18next'
import Head from "next/head";

function App({ Component, pageProps }: AppProps) {
  const {locale} = useRouter();


  return(  
    <>
      <Head>
        <title>Kanbanize Lite</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
      </Head>
      <Component {...pageProps} />
    </>
  )
  
}

export default appWithTranslation(App);