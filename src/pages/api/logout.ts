import passportConnect from 'utils/passportConnect'

export default passportConnect.get((req, res) => {
  req.logout()
  res.redirect('/')
})
