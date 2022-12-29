import Joi from 'joi'
import httpStatus from 'http-status'

import pick from '../helpers/pick.mjs'
import ApiError from '../helpers/ApiError.mjs'
import { config } from '../validations/index.mjs'
import logger from '../config/logger.mjs'

export const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body'])

  const object = pick(req, Object.keys(validSchema))

  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object)

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ')
    if (config.nodeEnv === 'development') logger.warn(errorMessage)

    return next(new ApiError(httpStatus.BAD_REQUEST, httpStatus[400]))
  }
  Object.assign(req, value)
  return next()
}
