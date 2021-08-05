import React, { FC } from 'react'
import { signOut, useSession } from 'next-auth/client'

const LinkedInAccount: FC = () => {
  const [session] = useSession()

  return (
    <div>
      <div>
        <h2 className="title">LinkedIn account</h2>
        <div className="uk-flex">
          <div className="uk-margin-small-right">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="uk-border-circle"
              width={32}
              height={32}
              src={session.user.image}
              alt="avatar"
            />
          </div>
          <div>
            {session.user.name}
            <br />
            <button
              onClick={() => signOut()}
              type="button"
              className="uk-button uk-button-small uk-button-primary"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LinkedInAccount
