import { NextApiRequest, NextApiResponse } from 'next'
import passport, { Profile } from 'passport'
import nextConnect from 'next-connect'
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2'
import { Strategy as GitHubStrategy } from 'passport-github'
import cookieSession from 'cookie-session'
import express from 'express'

import connectToDatabase from './mongodb'
import config from './config'

const removePrefixedKeys = (obj: Profile, prefix = '_'): Profile => {
  const output = obj

  Object.keys(obj).forEach(key => {
    if (key.indexOf(prefix) === 0) {
      delete output[key]
    }
  })

  return output
}

passport.serializeUser((user: Profile, done) => {
  console.log('serialize', user)
  done(null, user?.id)
})

passport.deserializeUser(async (id: string, done) => {
  try {
    const { db } = await connectToDatabase()
    const result = await db
      .collection('users')
      .find({
        _id: id,
      })
      .toArray()
    const user = result[0]
    const linkedIn = user?.linkedIn?.profile
    const gitHub = user?.gitHub?.profile
    done(null, { id, linkedIn, gitHub })
  } catch (error) {
    done(error)
  }
})

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: `${config.host}/api/linkedin/callback`,
      scope: ['r_emailaddress', 'r_liteprofile', 'w_member_social'],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const user = removePrefixedKeys(profile)
        const { db } = await connectToDatabase()
        await db.collection('users').updateOne(
          { _id: user.id },
          {
            $set: {
              linkedIn: {
                profile: user,
                accessToken,
                refreshToken,
              },
            },
          },
          { upsert: true },
        )
        done(null, user)
      } catch (error) {
        done(error)
      }
    },
  ),
)

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: ['read:user'],
      callbackURL: `${config.host}/api/github/callback`,
      passReqToCallback: true,
    },
    () => {},
  ),
)

export default nextConnect<
  NextApiRequest & {
    user?: Express.User
    account?: Express.User
    logout?: () => void
  } & CookieSessionInterfaces.CookieSessionRequest,
  NextApiResponse
>()
  .use(express.urlencoded())
  .use(
    cookieSession({
      maxAge: 24 * 60 * 60 * 1000 * 31 * 2, // 2 months - LinkedIn token lifetime
      keys: [process.env.SESSION_SECRET],
    }),
  )
  .use(passport.initialize())
  .use(passport.session())
