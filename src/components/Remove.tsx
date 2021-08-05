import React, { FC } from 'react'
import { useSession } from 'next-auth/client'
import useRemoveAccount from 'hooks/useRemoveAccount'
import useUser from 'hooks/useUser'

const Remove: FC = () => {
  const [session] = useSession()
  const { data: user } = useUser()
  const [removeAccount, isLoading] = useRemoveAccount()

  return session && user ? (
    <>
      <div className="uk-margin">
        {isLoading ? (
          <span data-uk-spinner="" />
        ) : (
          <button
            onClick={removeAccount}
            type="button"
            className="uk-button uk-button-small uk-button-danger"
            disabled={!session}
          >
            Remove account
          </button>
        )}
      </div>
    </>
  ) : (
    <></>
  )
}

export default Remove
