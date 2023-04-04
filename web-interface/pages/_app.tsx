import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import {IntlProvider} from 'react-intl'
import { appWithTranslation } from 'next-i18next'

function App({ Component, pageProps }: AppProps) {
  const {locale} = useRouter();


  return(  
      <Component {...pageProps} />
  )
  
}

export default appWithTranslation(App);