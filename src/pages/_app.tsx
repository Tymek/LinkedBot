import App from 'next/app'
import type { AppContext, AppProps /* , AppContext */ } from 'next/app'
import { useEffect } from 'react'
import Head from 'next/head'
import { SWRConfig } from 'swr'
import UIkit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons'
import fetcher from 'utils/fetcher'
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
      <SWRConfig value={{ fetcher }}>
        <Component {...pageProps} />
      </SWRConfig>
    </>
  )
}

CustomApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext)

  return { ...appProps }
}

export default CustomApp
