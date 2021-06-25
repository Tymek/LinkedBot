import passport from 'passport'
import nextConnect from 'next-connect'
import session from 'express-session'
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2'
import config from '../../../utils/config'

const options = {
  clientID: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  callbackURL: `${config.host}/api/linkedin/callback`,
  scope: ['r_emailaddress', 'r_liteprofile', 'w_share'],
  state: true,
}

passport.use(
  new LinkedInStrategy(options, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
      console.log({ profile })
      return done(null, profile)
    })
  }),
)

console.log({ options })

export default nextConnect()
  .use(
    session({
      secret: process.env.SESSION_SECRET,
      // resave: false,
      // saveUninitialized: true,
      // cookie: { secure: true }
    }),
  )
  .use(passport.initialize())
  .get(passport.authenticate('linkedin'))
