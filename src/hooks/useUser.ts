import { Session } from 'next-auth'
import useSWR, { SWRResponse } from 'swr'
import { Account } from 'utils/types'

type UserData = {
  session: Session
  user?: Pick<Account, '_id' | 'createdAt' | 'updatedAt'> & {
    name: string
    image: string
  }
  accounts: Account[]
}

const useUser = (): SWRResponse<UserData, unknown> =>
  useSWR<UserData>('/api/session')

export default useUser
