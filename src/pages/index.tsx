/* eslint-disable @next/next/no-img-element */
import { FC } from 'react'
import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import connectToDatabase from 'utils/mongodb'
import Icon from 'components/Icon'
import Footer from 'components/Footer'
import { signIn, useSession } from 'next-auth/client'
import LinkedInAccount from 'components/LinkedInAccount'
import useUser from 'hooks/useUser'
import Remove from 'components/Remove'

const GitHubAccount = dynamic(() => import('components/GitHubAccount'), {
  ssr: false,
})

const Home: FC<{ isConnected: boolean }> = ({ isConnected }) => {
  const [session, loading] = useSession()
  const { data: user } = useUser()
  const linkedinAccount = user?.accounts?.find(
    ({ providerId }) => providerId === 'linkedin',
  )
  const githubAccount = user?.accounts?.find(
    ({ providerId }) => providerId === 'github',
  )

  return (
    <div className="uk-container">
      <main className="uk-margin-top">
        {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
        <h1 className="uk-heading-large">LinkedBot</h1>
        <p>Automagically publish your GitHub activity to LinkedIn.</p>
        {loading ? (
          <span data-uk-spinner="" />
        ) : (
          <>
            <div className="uk-margin-large-bottom">
              {session && linkedinAccount ? (
                <LinkedInAccount />
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

            {session && linkedinAccount && (
              <div className="uk-margin">
                {githubAccount ? (
                  <GitHubAccount />
                ) : (
                  <button
                    onClick={() => signIn('github')}
                    type="button"
                    className="uk-button uk-button-secondary"
                    disabled={!session}
                  >
                    Connect to GitHub
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* <p className="uk-text-warning">
          <Icon name="warning" ratio={1} /> Token TTL is 2 months. You will need
          to re-authorize.
        </p> */}
        <br />
        <hr />

        <Remove />
        <p>
          Database status:{' '}
          {isConnected ? (
            <span className="uk-text-success">
              <Icon name="check" ratio={1.2} />
              operational
            </span>
          ) : (
            <span className="uk-text-danger">
              <Icon name="close" ratio={1.2} />
              disconnected
            </span>
          )}
        </p>
      </main>

      <Footer />
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    await connectToDatabase()

    return {
      props: { isConnected: true },
    }
  } catch {
    return { props: {} }
  }
}
