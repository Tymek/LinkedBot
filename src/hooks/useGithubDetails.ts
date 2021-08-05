import { useCallback } from 'react'
import useSWR, { SWRResponse } from 'swr'
import type { GithubUserData } from 'utils/types'

import useUser from './useUser'

const useGithubDetails = (): SWRResponse<GithubUserData, unknown> => {
  const { data: user } = useUser()

  const githubAccount = user?.accounts?.find(
    ({ providerId }) => providerId === 'github',
  )

  const fetcher = useCallback(
    async url =>
      githubAccount?.accessToken &&
      (await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `token ${githubAccount?.accessToken}`,
          'Content-Type': 'application/json',
        },
      }).then(data => data.json())),
    [githubAccount?.accessToken],
  )

  return useSWR<GithubUserData, unknown>('https://api.github.com/user', {
    fetcher,
  })
}

export default useGithubDetails
