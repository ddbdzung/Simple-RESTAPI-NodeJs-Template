/* eslint-disable max-len */
import httpStatus from 'http-status'

import { getRandomArbitrary } from '../common/generateOTP.mjs'
import { httpResponse } from '../helpers/httpResponse.mjs'
import catchAsync from '../helpers/catchAsync.mjs'
import pick from '../helpers/pick.mjs'
import {
  authService,
  emailService,
  tokenService,
  userService,
} from '../services/index.mjs'
import sanitize from '../helpers/sanitizeDocument.mjs'
import { errorResponseSpecification } from '../helpers/errorResponse.mjs'
import {
  status,
  expireOTP,
  LIMIT_RESET_PASSWORD_REQUEST,
} from '../constants/index.mjs'
import { resetPw } from '../constants/mail.mjs'
import ApiError from '../helpers/ApiError.mjs'
import { config } from '../validations/index.mjs'
import { stringToDate } from '../common/toDate.mjs'

export const register = catchAsync(async (req, res) => {
  const doc = pick(req.body, ['fullname', 'email', 'password'])
  try {
    const user = await userService.createUser(doc)
    const { resetPwRate, ...sanitizedUser } = sanitize(user, 0)

    const tokens = tokenService.generateAuthTokens(sanitizedUser)

    await tokenService.createSessionUser(tokens.refresh.token, user._id);

    httpResponse(res, httpStatus.CREATED, httpStatus[201], {
      tokens,
      user: sanitizedUser,
    })
  } catch (e) {
    errorResponseSpecification(e, res, [httpStatus.BAD_REQUEST])
  }
})

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body
  try {
    const { resetPwRate, ...sanitizedUser } = await authService.loginWithEmailAndPassword(email, password)
    const tokens = tokenService.generateAuthTokens(sanitizedUser)

    await tokenService.createSessionUser(tokens.refresh.token, sanitizedUser.id);

    httpResponse(res, httpStatus.OK, httpStatus[200], {
      user: sanitizedUser,
      tokens,
    })
  } catch (e) {
    errorResponseSpecification(e, res, [httpStatus.UNAUTHORIZED])
  }
})

export const findAccount = catchAsync(async (req, res) => {
  const { email } = req.body
  const user = await userService.getUserByEmail(email)
  if (!user || user.status === status.INACTIVE) {
    throw new ApiError(httpStatus.UNAUTHORIZED, httpStatus[401])
  }

  // Reset rate limit when user reach rate limit
  if (user.resetPwRate === 5) {
    user.resetPwRate = 0
  }

  const token = tokenService.generateToken({ sub: user._id, email: user.email }, config.defaultTokenKey, { expiresIn: 5 * 60 }) // Expires in 5 mins
  user.findAccountToken = token

  await user.save()

  httpResponse(res, httpStatus.OK, httpStatus[200], { token })
})

export const sendResetPwMail = catchAsync(async (req, res) => {
  const { token } = req.body
  // Temporary not using sending code OTP by phone number
  try {
    const { sub } = tokenService.verifyToken(token, 'default')
    const user = await userService.getUserById(sub)
    if (!user || !user?.findAccountToken || user.findAccountToken !== token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, httpStatus[401])
    }

    const otp = getRandomArbitrary()
    user.resetPwCode = otp
    user.resetPwIssued = Date.now()

    await user.save()
    await emailService.sendEmail(user.email, resetPw(otp))

    // Token expires in 30 mins
    const clientToken = tokenService.generateToken({ sub: user._id }, config.clientRPTokenKey, { expiresIn: 30 * 60 })

    httpResponse(res, httpStatus.OK, httpStatus[200], {
      token: clientToken,
    })
  } catch (err) {
    errorResponseSpecification(err, res, [httpStatus.UNAUTHORIZED])
  }
})

export const checkResetPwCode = catchAsync(async (req, res) => {
  const { token, secureCode } = req.body

  try {
    const { sub } = tokenService.verifyToken(token, 'client')

    const user = await userService.getUserById(sub)
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, httpStatus[401])
    }

    if (user.resetPwRate >= LIMIT_RESET_PASSWORD_REQUEST) {
      throw new ApiError(httpStatus.FORBIDDEN, httpStatus[403])
    } else {
      user.resetPwRate += 1
    }

    if (!user?.resetPwCode && !user?.resetPwIssued && !user?.findAccountToken) {
      throw new ApiError(httpStatus.FORBIDDEN, httpStatus[403])
    }

    const isExpired = Date.now() - stringToDate(user.resetPwIssued) > expireOTP
    if (isExpired) {
      await user.save()

      throw new ApiError(httpStatus.UNAUTHORIZED, httpStatus[401])
    }

    if (user?.resetPwCode !== secureCode) {
      await user.save()

      throw new ApiError(httpStatus.UNAUTHORIZED, httpStatus[401])
    }

    user.resetPwCode = undefined
    user.resetPwRate = 0
    user.resetPwIssued = undefined
    user.findAccountToken = undefined
    // Expires in 30 mins
    user.resetPwToken = tokenService.generateToken({ sub: user._id }, config.secureTokenKey, { expiresIn: 30 * 60 })
    await user.save()

    httpResponse(res, httpStatus.OK, httpStatus[200], {
      token: user.resetPwToken,
    })
  } catch (err) {
    return errorResponseSpecification(err, res, [
      httpStatus.UNAUTHORIZED,
      httpStatus.FORBIDDEN,
    ])
  }
})

export const resetPassword = catchAsync(async (req, res) => {
  const { token, resetPassword: upcomingPw } = req.body

  try {
    const { sub } = tokenService.verifyToken(token, 'secure')
    const user = await userService.getUserById(sub)
    if (!user || !user?.resetPwToken || user?.resetPwToken !== token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, httpStatus[401])
    }

    user.password = userService.hashPassword(upcomingPw)
    user.resetPwToken = undefined
    await user.save()

    httpResponse(res, httpStatus.OK, httpStatus[200])
  } catch (err) {
    return errorResponseSpecification(err, res, [httpStatus.UNAUTHORIZED])
  }
})

export const refreshToken = catchAsync(async (req, res) => {
  const authHeader = req.headers?.authorization
  const { refresh } = req.body
  try {
    if (!authHeader) {
      throw new ApiError(httpStatus.BAD_REQUEST, httpStatus[400])
    }

    const session = await tokenService.getSessionByToken(refresh)
    if (!session) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Token not found')
    }

    if (session.isBlacklisted) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token')
    }

    await tokenService.verifyToken(refresh, 'refresh', 'Expired token')

    const newTokens = tokenService.generateAuthTokens(session.user)
    session.token = newTokens.refresh.token
    session.previousToken = refresh

    await session.save()

    return httpResponse(res, httpStatus.CREATED, httpStatus[201], {
      ...newTokens,
    })
  } catch (err) {
    return errorResponseSpecification(err, res, [httpStatus.BAD_REQUEST, httpStatus.UNAUTHORIZED])
  }
})

export const logout = catchAsync(async (req, res) => {
  const { refresh } = req.body
  const authHeader = req.headers?.authorization
  try {
    if (!authHeader) {
      throw new ApiError(httpStatus.BAD_REQUEST, httpStatus[400])
    }

    const AT = authHeader.split(' ')[1]
    const decodedAT = tokenService.decodeToken(AT)
    if (!decodedAT?.sub) {
      throw new ApiError(httpStatus.BAD_REQUEST, httpStatus[400])
    }

    if (!(await userService.getUserById(decodedAT?.sub))) {
      throw new ApiError(httpStatus.BAD_REQUEST, httpStatus[400])
    }

    const session = await tokenService.removeSession(refresh)
    if (!session) {
      throw new ApiError(httpStatus.NOT_FOUND, httpStatus[404])
    }

    return httpResponse(res, httpStatus.OK, httpStatus[200])
  } catch (err) {
    return errorResponseSpecification(err, res, [httpStatus.BAD_REQUEST, httpStatus.NOT_FOUND])
  }
})

export const ping = catchAsync(async (req, res) => {
  httpResponse(res, httpStatus.OK, httpStatus[200])
})
