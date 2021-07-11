/* eslint-disable @next/next/no-img-element */
import { FC } from 'react'
import { GetServerSideProps } from 'next'
import A from 'next/link'
import connectToDatabase from 'utils/mongodb'
import Icon from 'components/Icon'
import Footer from 'components/Footer'
import useUser from 'hooks/useUser'

const Home: FC<{ isConnected: boolean }> = ({ isConnected }) => {
  const { data: user } = useUser()
  const linkedInName = user?.linkedIn?.displayName
  const linkedInPhoto =
    user?.linkedIn?.photos && user?.linkedIn?.photos.length
      ? user?.linkedIn?.photos[0].value
      : ''

  return (
    <div className="uk-container">
      <main className="uk-margin-top">
        {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
        <h1 className="uk-heading-large">LinkedBot</h1>
        <p>Automagically publish your GitHub activity to LinkedIn.</p>

        <div className="uk-margin-large-bottom">
          {linkedInName ? (
            <div>
              <div>
                <h2 className="title">LinkedIn account</h2>
                <div className="uk-flex">
                  <div className="uk-margin-small-right">
                    <img
                      className="uk-border-circle"
                      width={32}
                      height={32}
                      src={linkedInPhoto}
                      alt="avatar"
                    />
                  </div>
                  <div>
                    {linkedInName}
                    <br />
                    <A href="/api/logout">
                      <button
                        type="button"
                        className="uk-button uk-button-small uk-button-primary"
                      >
                        Logout
                      </button>
                    </A>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <A href="/api/linkedin/login">
              <button type="button" className="uk-button uk-button-primary">
                Connect to LinkedIn
              </button>
            </A>
          )}
        </div>
        <div className="uk-margin">
          <A href="/api/github/login">
            <button
              type="button"
              className="uk-button uk-button-secondary"
              disabled
            >
              Connect to GitHub
            </button>
          </A>
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
