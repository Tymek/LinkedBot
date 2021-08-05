/* eslint-disable @typescript-eslint/no-explicit-any */

import { ObjectId } from 'mongodb'

export type Account = {
  _id: ObjectId
  compoundId: string
  userId: ObjectId
  providerType: string
  providerId: string
  providerAccountId: number | string
  refreshToken: string | null
  accessToken: string | null
  accessTokenExpires: string | null
  createdAt: string
  updatedAt: string
  login?: string
  lastActivityPublishedAt?: Date
}

export type Activity = {
  _id?: ObjectId
  id: string
  accountId: ObjectId
  user: GithubEvent['actor']['login']
  repo: GithubEvent['repo']['name']
  created_at: GithubEvent['created_at']
  githubToken?: string
  linkedinId: string | number
  linkedinToken: string
  published?: boolean | null
  stars?: number | null
  forks?: number | null
  watchers?: number | null
}

export type GithubEvent = {
  id: string
  type: string
  actor: {
    id: number
    login: string
    display_login: string
    gravatar_id: string
    url: string
    avatar_url: string
  }
  repo: {
    id: number
    name: string
    url: string
  }
  payload: {
    action: string
  }
  public: boolean
  created_at: string
  org: {
    id: number
    login: string
    gravatar_id: string
    url: string
    avatar_url: string
  }
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

export type GithubRepoDetails = {
  id: number
  node_id: string
  name: string
  full_name: string
  private: boolean
  owner: {
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
  }
  html_url: string
  description: string
  fork: boolean
  url: string
  forks_url: string
  keys_url: string
  collaborators_url: string
  teams_url: string
  hooks_url: string
  issue_events_url: string
  events_url: string
  assignees_url: string
  branches_url: string
  tags_url: string
  blobs_url: string
  git_tags_url: string
  git_refs_url: string
  trees_url: string
  statuses_url: string
  languages_url: string
  stargazers_url: string
  contributors_url: string
  subscribers_url: string
  subscription_url: string
  commits_url: string
  git_commits_url: string
  comments_url: string
  issue_comment_url: string
  contents_url: string
  compare_url: string
  merges_url: string
  archive_url: string
  downloads_url: string
  issues_url: string
  pulls_url: string
  milestones_url: string
  notifications_url: string
  labels_url: string
  releases_url: string
  deployments_url: string
  created_at: Date
  updated_at: Date
  pushed_at: Date
  git_url: string
  ssh_url: string
  clone_url: string
  svn_url: string
  homepage: string
  size: number
  stargazers_count: number
  watchers_count: number
  language: string
  has_issues: boolean
  has_projects: boolean
  has_downloads: boolean
  has_wiki: boolean
  has_pages: boolean
  forks_count: number
  mirror_url?: any
  archived: boolean
  disabled: boolean
  open_issues_count: number
  license: {
    key: string
    name: string
    spdx_id: string
    url: string
    node_id: string
  }
  forks: number
  open_issues: number
  watchers: number
  default_branch: string
  permissions: {
    admin: boolean
    push: boolean
    pull: boolean
  }
  temp_clone_token: string
  network_count: number
  subscribers_count: number
}
