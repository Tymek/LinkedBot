import { Profile } from 'passport'
import useSWR from 'swr'

const useUser = () =>
  useSWR<{
    id?: string
    linkedIn?: Profile
    github?: Profile
  }>('/api/user')

export default useUser
