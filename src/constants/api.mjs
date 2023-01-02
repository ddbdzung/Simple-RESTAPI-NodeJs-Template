export const V1 = '/api/v1'

export const ENDPOINTS = {
  ADMIN: 'admin',
  CLIENT: 'client',
  AUTH: {
    BASE: 'auth',
    REGISTER: 'register',
    LOGIN: 'sign-in',
    FIND_ACCOUNT: 'find-account',
    RESETPW_EMAIL: 'resetpw-email',
    VALIDATE_PWCODE: 'confirm-pwcode',
    RESET_PASSWORD: 'reset-pw',
    REFRESH_TOKEN: 'refresh-token',
    LOGOUT: 'sign-out',
    PING: 'ping',
  },
  SSE: {
    BASE: 'sse',
    VALIDATE_EMAIL: 'activate-account',
  },
  USER: {
    BASE: 'user',
    VALIDATE_EMAIL: 'confirm-email',
  },
  DOCS: {
    BASE: 'docs',
  },
}
