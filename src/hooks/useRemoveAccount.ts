import { useCallback, useState } from 'react'
import { mutate } from 'swr'

const useRemoveAccount = (): [() => void, boolean] => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const action = useCallback(() => {
    setIsLoading(true)

    return fetch('/api/removeAccount', {
      method: 'POST',
    })
      .then(data => {
        return data.json()
      })
      .finally(() => {
        mutate('/api/session').finally(() => {
          setIsLoading(false)
        })
      })
  }, [])

  return [action, isLoading]
}

export default useRemoveAccount
