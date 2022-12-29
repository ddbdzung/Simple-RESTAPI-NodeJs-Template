import mongoose from 'mongoose'
import httpStatus from 'http-status'

import logger from '../config/logger.mjs'
import ApiError from '../helpers/ApiError.mjs'

const errorConverter = (err, req, res, next) => {
  let error = err
  if (!(error instanceof ApiError)) {
    // eslint-disable-next-line max-len
    const statusCode = error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR
    const message = error.message || httpStatus[statusCode]
    error = new ApiError(statusCode, message, false, err.stack)
  }
  next(error)
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err

  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR]
  }

  res.locals.errorMessage = err.message

  const response = {
    code: statusCode,
    message,
    ...((process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') && { stack: err.stack }),
  }

  if (process.env.NODE_ENV === 'development') {
    logger.error(err)
  }

  res.status(statusCode).send(response)
}

export {
  errorConverter,
  errorHandler,
}
