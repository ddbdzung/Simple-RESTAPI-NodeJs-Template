import morgan, { token } from 'morgan'

import logger from '../config/logger.mjs'
import stream from './rtf.mjs'

// Get error message
token('message', (req, res) => res.locals.errorMessage || '')
// Get user id if exists
token('userId', (req, res) => res.locals.user || '')

const getIpFormat = () => (process.env.NODE_ENV === 'production' ? ':remote-addr - ' : '')
const successResponseFormat = `:userId & ${getIpFormat()}:method :url :status & :response-time ms`
const errorResponseFormat = `:userId & ${getIpFormat()}:method :url :status & :response-time ms & message: :message`

const successHandler = morgan(successResponseFormat, {
  stream,
  skip: (req, res) => res.statusCode >= 400,
  // stream: { write: (message) => logger.info(message.trim()) },
})

const errorHandler = morgan(errorResponseFormat, {
  stream,
  skip: (req, res) => res.statusCode < 400,
  // stream: { write: (message) => logger.error(message.trim()) },
})

export {
  successHandler,
  errorHandler,
  successResponseFormat,
  errorResponseFormat,
  morgan,
}