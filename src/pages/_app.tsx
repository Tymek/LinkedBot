import App from 'next/app'
import type { AppContext, AppProps /* , AppContext */ } from 'next/app'
import { useEffect } from 'react'
import Head from 'next/head'
import UIkit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons'
import { Provider as NextAuthProvider } from 'next-auth/client'
import 'utils/style.scss'

const CustomApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  useEffect(() => {
    UIkit.use(Icons)
  })

  return (
    <>
      <Head>
        <title>LinkedBot</title>
        <link rel="icon" type="image/ico" href="/favicon.ico" />
      </Head>
      <NextAuthProvider session={pageProps.session}>
        <Component {...pageProps} />
      </NextAuthProvider>
    </>
  )
}

CustomApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext)

  return { ...appProps }
}

export default CustomApp
