import httpStatus from 'http-status'

import { verifyAccount } from '../constants/mail.mjs'
import { status } from '../constants/user.mjs'
import ApiError from '../helpers/ApiError.mjs'
import catchAsync from '../helpers/catchAsync.mjs'
import { errorResponseSpecification } from '../helpers/errorResponse.mjs'
import { httpResponse } from '../helpers/httpResponse.mjs'
import { emailService, tokenService, userService } from '../services/index.mjs'
import { sseActivateAccount } from '../routes/v1/sse.route.mjs'

export const sendValidationEmail = catchAsync(async (req, res) => {
  const { user } = req

  try {
    const validateAccountToken = user?.activateToken
    // If user is already activated or banned => Forbidden
    if (user.status === status.BANNED || user.status === status.ACTIVE) {
      throw new ApiError(httpStatus.FORBIDDEN, httpStatus[403])
    }

    // If this is the first time user send request to activate account => Send email
    if (!validateAccountToken) {
      const token = tokenService.generateValAccToken(user._id)
      user.activateToken = token

      await userService.updateUserById(user._id, { activateToken: token })
      await emailService.sendEmail(user.email, verifyAccount(token))

      return httpResponse(res, httpStatus.OK, 'Email sent')
    }

    // If user send request to activate account the second time => Verify if token is expired or not
    try {
      // If token is still valid => User must open recent mail to activate
      tokenService.verifyToken(validateAccountToken, 'validateAccount')

      httpResponse(res, httpStatus.OK, 'Email already exist. Check mailbox')
    } catch (e) {
      // If token is expired => remove the old and create new one and send another mail to user
      if (e.message === httpStatus[401]) {
        const token = tokenService.generateValAccToken(user._id)
        user.activateToken = token

        await userService.updateUserById(user._id, { activateToken: token })
        await emailService.sendEmail(user.email, verifyAccount(token))

        return httpResponse(res, httpStatus.CREATED, 'New email sent')
      }
    }
  } catch (err) {
    return errorResponseSpecification(err, res, [
      httpStatus.FORBIDDEN,
    ])
  }
})

export const confirmAccount = catchAsync(async (req, res) => {
  const { token } = req.params
  try {
    const { id } = tokenService.verifyToken(token, 'validateAccount', 'Invalid Token')

    const user = await userService.getUserById(id)

    // Prevent user from attemping to activate an verified / banned account
    // Or using a fake token to hack the verification system
    if (user?.activateToken === token && user.status === status.INACTIVE) {
      user.activateToken = undefined
      user.status = status.ACTIVE
      await user.save()
    } else {
      throw new ApiError(httpStatus.FORBIDDEN, httpStatus[403])
    }

    httpResponse(res, httpStatus.OK, httpStatus[200])

    sseActivateAccount.send({ hasActivated: true }, 'activateAccount')
  } catch (err) {
    errorResponseSpecification(err, res, [httpStatus.UNAUTHORIZED, httpStatus.FORBIDDEN])
  }
})
