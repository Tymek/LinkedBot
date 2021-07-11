import passport from 'passport'
import passportConnect from 'utils/passportConnect'

export default passportConnect
  .use(
    passport.authenticate('linkedin', {
      successRedirect: '/api/linkedin/callback',
      failureRedirect: '/',
    }),
  )
  .get((_, res) => {
    setTimeout(() => {
      res.redirect('/')
    }, 500)
  })
