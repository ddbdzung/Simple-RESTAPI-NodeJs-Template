/* eslint-disable max-len */
import { DateTime } from 'luxon'
import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'

import { Token } from '../models/index.mjs'
import { config } from '../validations/index.mjs'
import ApiError from '../helpers/ApiError.mjs'
import { TOKEN_KEY } from '../constants/token.mjs'

const {
  accessTokenLife,
  accessTokenKey,
  refreshTokenLife,
  refreshTokenKey,
} = config

export const generateToken = (payload, key, options) => jwt.sign(payload, key, options)

/**
 * Create a new session of user
 * @param {string} token refresh token
 * @param {string} id object id of user
 * @returns {Promise<mongoose>}
 */
export const createSessionUser = async (token, id) => Token.create({
  token,
  user: id,
})

export const generateAuthTokens = user => {
  const now = DateTime.now().toUnixInteger() // Epoch time in second
  const accessTokenExpires = accessTokenLife * 60 // In Second
  const refreshTokenExpires = refreshTokenLife * 60 * 60 * 24 // In second
  const id = user?._id || user?.id
  const { role, status } = user
  const payload = {
    role,
    status,
    sub: id,
    iat: now, // Epoch time in second
  }
  if (process.env.NODE_ENV === 'test') {
    // Unique token in test env with sync timer
    payload.salt = Math.random()
  }
  const accessToken = generateToken(payload, accessTokenKey, { expiresIn: accessTokenExpires })
  const refreshToken = generateToken(payload, refreshTokenKey, { expiresIn: refreshTokenExpires })

  return {
    access: {
      token: accessToken,
      expiresAt: now + accessTokenExpires, // Time expires in epoch second
    },
    refresh: {
      token: refreshToken,
      expiresAt: now + refreshTokenExpires, // Time expires in epoch second
    },
  }
}
/**
 * @Returns {string} a validate account token
 */
export const generateValAccToken = userId => generateToken({ id: userId }, config.validateAccountTokenKey, {
  expiresIn: config.validateAccountTokenLife * 60,
})

/**
 * Return decoded payload or throw API error when token is invalid
 * @param {string} token
 * @param {string} keyType 'access' | 'refresh' | 'validateAccount' | 'default' | 'client' | 'secure'
 * @param {string} msg custom message throw when token is invalid
 * @returns {object|error}
 */
export const verifyToken = (token, keyType = 'access', msg = undefined) => {
  const key = TOKEN_KEY[keyType]
  if (!key) throw new Error('Type error! Key must be valid exist type!')

  try {
    return jwt.verify(token, key)
  } catch (_err) {
    throw new ApiError(httpStatus.UNAUTHORIZED, msg || httpStatus[401])
  }
}

export const getSessionByToken = async token => Token.findOne({ token }).populate('user')

export const removeSession = async token => Token.findOneAndRemove({ token })