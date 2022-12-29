import { config } from '../validations/index.mjs'

export const TOKEN_KEY = {
  access: config.accessTokenKey,
  refresh: config.refreshTokenKey,
  validateAccount: config.validateAccountTokenKey,
  default: config.defaultTokenKey,
  client: config.clientRPTokenKey,
  secure: config.secureTokenKey,
}
