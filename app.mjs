import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import httpStatus from 'http-status'
import compression from 'compression'

import { config as configVars } from './src/validations/index.mjs'
import routes from './src/routes/v1/index.mjs'
import {
  errorHandler,
  successHandler,
} from './src/config/morgan.mjs'

import ApiError from './src/helpers/ApiError.mjs'
import {
  authLimiter,
  defaultLimiter,
  errorConverter as centralErrorConverter,
  errorHandler as centralErrorHandler,
} from './src/middlewares/index.mjs'

// Get current dirname
const __dirname = dirname(fileURLToPath(import.meta.url))
// Assign path to environment file
if (configVars.nodeEnv === 'development') {
  // eslint-disable-next-line import/no-extraneous-dependencies
  const { config } = await import('dotenv')
  config({ path: join(__dirname, '.env') })
}

// Init express app
const app = express()

// Apply middleware to app
// Handle success and error requests
if (process.env.NODE_ENV !== 'test') {
  app.use(successHandler);
  app.use(errorHandler);
}

// Allow CORS across-the-board
if (process.env.NODE_ENV === 'development') {
  app.use(cors())
  app.options('*', cors());
} else if (process.env.NODE_ENV === 'production') {
  app.use(cors({
    credentials: true,
    origin: [
      process.env.PROD_CLIENT_DOMAIN,
    ],
  }))
}

// gzip compression
app.use(compression());

// Secure app with various HTTP headers across-the-board
app.use(helmet())

// Sanitize request data like $ . characters
app.use(mongoSanitize())

// Only accept json data
app.use(express.json({ limit: '50mb' }))

// Parse data with URL-encoded like JSON
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

app.use('/api/v1', routes)

if (process.env.NODE_ENV === 'production') {
  // Apply rate limiter API by default
  app.use(defaultLimiter)
  // Apply rate limiter API to auth feature in order for security
  app.use('/api/v1/auth', authLimiter)
}

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, httpStatus[404]));
});

// convert error to ApiError, if needed
app.use(centralErrorConverter);

// handle error
app.use(centralErrorHandler);

export default app
