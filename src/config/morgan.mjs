import morgan, { token } from 'morgan'
import rfs from 'rotating-file-stream'
import fs from 'fs'

import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

import logger from './logger.mjs'
import { config } from '../validations/index.mjs'
import { getHighResDateTime } from '../helpers/dateToolkit.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

// eslint-disable-next-line no-unused-vars
const generator = (_time, _index) => `${getHighResDateTime()}.log`

let stream
// Create stream thread
if (config.nodeEnv === 'production') {
  const logsDir = path.join(__dirname, '..', 'logs')
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (!fs.existsSync(logsDir)) {
    logger.info('Logs directory not found. Now create logs directory')
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.mkdirSync(logsDir)
  }
  stream = rfs.createStream(generator, {
    size: '10M', // rotate every 10 MegaBytes written
    interval: '1d', // rotate daily
    path: path.join(__dirname, '..', 'logs'),
  })
} else if (config.nodeEnv === 'development') {
  stream = { write: (message) => logger.info(message.trim()) }
}
// Get error message
token('message', (req, res) => res.locals.errorMessage || '')
// Get user id if exists
token('userId', (req, res) => res.locals.user || '')

const getIpFormat = () => (config.nodeEnv === 'production' ? ':remote-addr - ' : '')
const successResponseFormat = `:userId & ${getIpFormat()}:method :url :status & :response-time ms`
const errorResponseFormat = `:userId & ${getIpFormat()}:method :url :status & :response-time ms & message: :message`

const successHandler = morgan(successResponseFormat, {
  stream,
  skip: (req, res) => res.statusCode >= 400,
})
const errorHandler = morgan(errorResponseFormat, {
  stream,
  skip: (req, res) => res.statusCode < 400,
})

export {
  successHandler,
  errorHandler,
  successResponseFormat,
  errorResponseFormat,
  morgan,
}
