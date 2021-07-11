import React, { FC } from 'react'
import dynamic from 'next/dynamic'
import A from 'next/link'

const GitHubButton = dynamic(() => import('react-github-btn'), { ssr: false })

const Footer: FC = () => {
  return (
    <footer>
      <div className="uk-margin-small">
        <A href="/privacy-policy">Privacy Policy</A>
        <br />
        License: MIT
        <br />
        Source:{' '}
        <a href="https://github.com/Tymek/LinkedOut">
          github.com/Tymek/LinkedOut
        </a>
      </div>
      <GitHubButton
        href="https://github.com/Tymek/LinkedOut"
        data-size="large"
        data-show-count="true"
        aria-label="Star Tymek/LinkedOut on GitHub"
      >
        Star
      </GitHubButton>
    </footer>
  )
}

export default Footer
