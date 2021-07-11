/* eslint-disable @next/next/no-img-element */
import { FC } from 'react'
import { GetServerSideProps } from 'next'
import connectToDatabase from 'utils/mongodb'
import Icon from 'components/Icon'
import Footer from 'components/Footer'
import { signIn, signOut, useSession } from 'next-auth/client'

const Home: FC<{ isConnected: boolean }> = ({ isConnected }) => {
  const [session, loading] = useSession() // TODO: loading

  return (
    <div className="uk-container">
      <main className="uk-margin-top">
        {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
        <h1 className="uk-heading-large">LinkedBot</h1>
        <p>Automagically publish your GitHub activity to LinkedIn.</p>

        {/* TODO: refactor into component? */}
        <div className="uk-margin-large-bottom">
          {session ? (
            <div>
              <div>
                <h2 className="title">LinkedIn account</h2>
                <div className="uk-flex">
                  <div className="uk-margin-small-right">
                    <img
                      className="uk-border-circle"
                      width={32}
                      height={32}
                      src={session.user.image}
                      alt="avatar"
                    />
                  </div>
                  <div>
                    {session.user.name}
                    <br />
                    <button
                      onClick={() => signOut()}
                      type="button"
                      className="uk-button uk-button-small uk-button-primary"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => signIn('linkedin')}
              type="button"
              className="uk-button uk-button-primary"
            >
              Connect to LinkedIn
            </button>
          )}
        </div>
        <div className="uk-margin">
          <button
            onClick={() => signIn('github')}
            // TODO: state - am I logged in with both
            type="button"
            className="uk-button uk-button-secondary"
            disabled={!session}
          >
            Connect to GitHub
          </button>
        </div>

        <p className="uk-text-warning">
          <Icon name="warning" ratio={1} /> Token TTL is 2 months. You will need
          to re-authorize.
        </p>

        <h3 className="subtitle">
          Database status:{' '}
          {isConnected ? (
            <span className="uk-text-success">
              <Icon name="check" ratio={2.5} />
              operational
            </span>
          ) : (
            <span className="uk-text-danger">
              <Icon name="close" ratio={2.5} />
              inactive
            </span>
          )}
        </h3>
      </main>

      <Footer />
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
