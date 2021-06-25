import App from 'next/app'
import type { AppContext, AppProps /* , AppContext */ } from 'next/app'
import { useEffect } from 'react'
import Head from 'next/head'
import UIkit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons'
import '../utils/style.scss'

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  useEffect(() => {
    UIkit.use(Icons)
  })

  return (
    <>
      <Head>
        <title>LinkedOut Bot</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext)

  return { ...appProps }
}

export default MyApp
