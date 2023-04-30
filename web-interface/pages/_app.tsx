import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { appWithTranslation } from 'next-i18next'
import Head from "next/head";
import '@fortawesome/fontawesome-svg-core/styles.css'
import Loader from '../components/Loader'
import { useState, useEffect, Fragment } from 'react';

function App({ Component, pageProps }: AppProps) {
  const {locale} = useRouter();
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  useEffect(() => {
        const handleStart = () => { setPageLoading(true); };
        const handleComplete = () => { setPageLoading(false); };
        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);
  }, [router]);

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
      {!pageLoading? (
        <Fragment>
          <Component {...pageProps} />
        </Fragment>
      ) : (
        <Loader/>
      )}
    </>
  )
  
}

export default appWithTranslation(App);
