import passport from 'passport'
import passportConnect from 'utils/passportConnect'

export default passportConnect
  .use(
    passport.authorize('github', {
      failureRedirect: '/',
    }),
  )
  .get((req, res) => {
    // console.log('\ntest??\n', Object.keys(req))
    res.redirect(301, '/')
    // return res.send(req.user || req.account)
  })
