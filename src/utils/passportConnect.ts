import passport from 'passport'
import nextConnect from 'next-connect'
import session from 'express-session'
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2'

import config from './config'

const options = {
  clientID: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  callbackURL: `${config.host}/api/linkedin/callback`,
  scope: ['r_emailaddress', 'r_liteprofile'],
  // scope: ['r_emailaddress', 'r_liteprofile', 'w_member_social'],
  state: true,
}

passport.use(
  new LinkedInStrategy(options, (accessToken, refreshToken, profile, done) => {
    console.log({ accessToken, refreshToken, profile, done })
    process.nextTick(() => {
      console.log({ profile })
      return done(null, profile)
    })
  }),
)

export default nextConnect()
  .use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      // cookie: { secure: true }
    }),
  )
  .use(passport.initialize())
