import confirmEmail from './confirmEmail.mjs'
import confirmAccount from './confirmAccount.mjs'

export default {
  '/api/v1/user/confirm-email': {
    ...confirmEmail,
  },
  '/api/v1/user/confirm-email/t={token}': {
    ...confirmAccount,
  },
}
