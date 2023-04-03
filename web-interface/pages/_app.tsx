import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import {IntlProvider} from 'react-intl'

import en from '../lang/en.json';
import es from '../lang/es.json';

const messages = {
  en,
  es
}

function App({ Component, pageProps }: AppProps) {
  const {locale} = useRouter();


  return(  
    <IntlProvider defaultLocale={locale} messages={locale}>
      <Component {...pageProps} />
    </IntlProvider>
  )
  
}

export default App;