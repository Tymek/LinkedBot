import passport from 'passport'

import passportConnect from '../../../utils/passportConnect'

export default passportConnect.get(passport.authenticate('linkedin'))
