/* eslint-disable @typescript-eslint/no-explicit-any */

export type Account = {
  _id: string
  compoundId: string
  userId: string
  providerType: string
  providerId: string
  providerAccountId: number
  refreshToken: string | null
  accessToken: string | null
  accessTokenExpires: string | null
  createdAt: string
  updatedAt: string
  login?: string
  lastActivityPublishedAt?: string
}

interface Actor {
  id: number
  login: string
  display_login: string
  gravatar_id: string
  url: string
  avatar_url: string
}

interface Repo {
  id: number
  name: string
  url: string
}

interface Payload {
  action: string
  ref: string
  ref_type: string
  pusher_type: string
  forkee: any
  push_id?: number
  size?: number
  distinct_size?: number
  head: string
  before: string
  commits?: any[]
  number?: number
  pull_request?: any
  review: any
}

interface Org {
  id: number
  login: string
  gravatar_id: string
  url: string
  avatar_url: string
}

export interface GithubEvent {
  id: string
  type: string
  actor: Actor
  repo: Repo
  payload: Payload
  public: boolean
  created_at: Date
  org: Org
}

export type GithubUserData = {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  name: string
  company: string
  blog: string
  location: string
  email: string
  hireable?: boolean | null
  bio: string
  twitter_username?: string | null
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: Date
  updated_at: Date
  private_gists: number
  total_private_repos: number
  owned_private_repos: number
  disk_usage: number
  collaborators: number
  two_factor_authentication: boolean
  plan: {
    name: string
    space: number
    collaborators: number
    private_repos: number
  }
}
