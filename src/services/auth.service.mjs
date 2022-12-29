/* eslint-disable import/prefer-default-export */
import httpStatus from 'http-status'
import ApiError from '../helpers/ApiError.mjs'

import { getUserByEmail, isPasswordMatch } from './user.service.mjs'
import { default as sanitize } from '../helpers/sanitizeDocument.mjs'

/**
 ** Login with email and password
 ** Check if email is existing in DB and
 ** Then check if password is match with user return from that email
 ** Throw api error UNAUTHORIZED code 401 if email or/and password fail
 ** Return user object
 * @param {string} email
 * @param {string} password
 * @returns {object} user
 */
export const loginWithEmailAndPassword = async (email, password) => {
  const user = await getUserByEmail(email)
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Địa chỉ email hoặc mật khẩu không đúng.')
  }

  if (!isPasswordMatch(user, password)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Địa chỉ email hoặc mật khẩu không đúng.')
  }

  return sanitize(user, 0)
}
