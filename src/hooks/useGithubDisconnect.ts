import { useCallback, useState } from 'react'
import { mutate } from 'swr'

const useGithubDisconnect = (): [() => void, boolean] => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const action = useCallback(() => {
    setIsLoading(true)

    return fetch('/api/disconnectGithub', {
      method: 'POST',
    })
      .then(data => {
        return data.json()
      })
      .finally(() => {
        mutate('/api/session').finally(() => {
          mutate('https://api.github.com/user').finally(() => {
            setIsLoading(false)
          })
        })
      })
  }, [])

  return [action, isLoading]
}

export default useGithubDisconnect
