import passportConnect from 'utils/passportConnect'

export default passportConnect.get((req, res) => res.send(req.user || false))
