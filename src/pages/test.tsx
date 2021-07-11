import { FC } from 'react'
import { GetServerSideProps } from 'next'
import { getSession, signIn, signOut, useSession } from 'next-auth/client'

const Page: FC = () => {
  const [session, loading] = useSession()

  return (
    <>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <button type="button" onClick={() => signIn()}>
        Sign in
      </button>
      <br />
      <br />
      <br />
      {!session && (
        <>
          Not signed in <br />
          <button type="button" onClick={() => signIn()}>
            Sign in
          </button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user.name} <br />
          <button type="button" onClick={() => signOut()}>
            Sign out
          </button>
        </>
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  return {
    props: {
      session: await getSession(ctx),
    },
  }
}

export default Page
