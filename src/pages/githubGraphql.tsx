import { FC, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { createGraphiQLFetcher } from '@graphiql/toolkit'
import 'graphiql/graphiql.min.css'
import useUser from 'hooks/useUser'
// import useUser from 'hooks/useUser'

const GraphiQL = dynamic(() => import('graphiql'), {
  ssr: false,
})

const GQLPage: FC = () => {
  // const [session, loading] = useSession()
  const { data: user } = useUser()
  const githubAccount = user?.accounts?.find(
    ({ providerId }) => providerId === 'github',
  )
  const [fetcher, setFetcher] = useState<ReturnType<
    typeof createGraphiQLFetcher
  > | null>(null)
  useEffect(() => {
    setFetcher(() =>
      createGraphiQLFetcher({
        url: 'https://api.github.com/graphql',
      }),
    )
  }, [])

  return (
    <div style={{ height: '100vh' }}>
      {fetcher && (
        <GraphiQL
          fetcher={fetcher}
          editorTheme="dracula"
          headerEditorEnabled
          headers={JSON.stringify({
            Authorization: `token ${githubAccount?.accessToken}`,
          })}
        />
      )}{' '}
    </div>
  )
}

export default GQLPage
