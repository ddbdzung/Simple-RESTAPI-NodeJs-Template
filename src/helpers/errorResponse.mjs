import httpStatus from 'http-status'

import logger from '../config/logger.mjs'
import { config } from '../validations/index.mjs'

/**
 * Return immediately error response with status code and message thrown from api error
 * @param {object} res response object
 * @param {number} code status code
 * @param {string} message message from thrown error
 * @returns {object} Object with end method
 * {code: code, message: message}
 */
const errorResponse = (res, code, message) => res.status(code).send({
  code,
  message,
})

/**
 * Return filtered error. Otherwise return 500 Internal server error
 * @param {object} err error object
 * @param {object} res response object
 * @param {array<string>} codeArr array of status codes
 * @returns {object} Object with end method
 * {code: code, message: message}
 */
export const errorResponseSpecification = (err, res, codeArr = []) => {
  const { statusCode, message } = err
  // Morgan will catch error from here for logging in terminal server
  res.locals.errorMessage = message
  if (config.nodeEnv === 'development' || process.env.NODE_ENV === 'development') {
    logger.error(err)
  }
  if (config.nodeEnv === 'test' || process.env.NODE_ENV === 'test') {
    // eslint-disable-next-line no-console
    // console.log(err.message)
  }

  if (codeArr && codeArr.includes(statusCode)) {
    return errorResponse(res, statusCode, message)
  }

  return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, httpStatus[500])
}
