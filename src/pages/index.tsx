import { FC } from 'react'
import dynamic from 'next/dynamic'
import A from 'next/link'
import { GetServerSideProps } from 'next'

import connectToDatabase from '../utils/mongodb'

const GitHubButton = dynamic(() => import('react-github-btn'), { ssr: false })

const Home: FC<{ isConnected: boolean }> = ({ isConnected }) => {
  return (
    <div className="uk-container">
      <main className="uk-margin-top">
        <h1 className="title">LinkedBot</h1>
        <p>Automagically publish your GitHub activity to LinkedIn.</p>

        <p className="uk-margin-small">
          <button type="button" className="uk-button uk-button-secondary">
            Connect to GitHub
          </button>
          <A href="/api/linkedin/login">
            <button type="button" className="uk-button uk-button-primary">
              Connect to LinkedIn
            </button>
          </A>
        </p>

        <p className="uk-text-warning">
          <span uk-icon="icon: warning; ratio: 1" /> Token TTL is 2 months. You
          will need to re-authorize.
        </p>

        <h3 className="subtitle">
          Database status:{' '}
          {isConnected ? (
            <span className="uk-text-success">
              <span uk-icon="icon: check; ratio: 2.5" />
              operational
            </span>
          ) : (
            <span className="uk-text-danger">
              <span uk-icon="icon: close; ratio: 2.5" />
              inactive
            </span>
          )}
        </h3>
      </main>

      <footer>
        <div className="uk-margin-small">
          <A href="/privacy-policy">Privacy Policy</A>
        </div>
        <div className="uk-margin-small">
          <a href="https://github.com/Tymek/LinkedOut">
            github.com/Tymek/LinkedOut
          </a>
        </div>
        <GitHubButton
          href="https://github.com/Tymek/LinkedOut"
          data-size="large"
          data-show-count="true"
          aria-label="Star Tymek/LinkedOut on GitHub">
          Star
        </GitHubButton>
      </footer>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const { client } = await connectToDatabase()

    const isConnected = await client.isConnected()

    return {
      props: { isConnected },
    }
  } catch {
    return { props: {} }
  }
}
