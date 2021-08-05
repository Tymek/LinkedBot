import useGithubDetails from 'hooks/useGithubDetails'
import useGithubDisconnect from 'hooks/useGithubDisconnect'
import React, { FC } from 'react'

const GitHubAccount: FC = () => {
  const { data } = useGithubDetails()
  const [disconnectGithub, isLoading] = useGithubDisconnect()

  if (!data) {
    return <></>
  }

  return (
    <>
      <div>
        <div>
          <h2 className="title">GitHub account</h2>
          <div className="uk-flex">
            <div className="uk-margin-small-right">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="uk-border-circle"
                width={32}
                height={32}
                src={data?.avatar_url}
                alt="avatar"
              />
            </div>
            <div>
              {data?.login}
              <br />
              {isLoading ? (
                <span data-uk-spinner="" />
              ) : (
                <button
                  onClick={disconnectGithub}
                  type="button"
                  className="uk-button uk-button-small uk-button-secondary"
                >
                  Disconnect
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default GitHubAccount
