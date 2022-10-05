import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
// Get current dirname
const __dirname = dirname(fileURLToPath(import.meta.url))
// Assign path to environment file
if (process.env.NODE_ENV === 'development') {
  const dotenv = await import('dotenv')
  dotenv.config({ path: path.join(__dirname, '.env') })
}

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import {
  errorHandler,
  successHandler
} from './src/config/morgan.mjs'
import httpStatus from 'http-status'

import ApiError from './src/helpers/ApiError.mjs'
import {
  defaultLimiter,
  errorConverter as centralErrorConverter,
  errorHandler as centralErrorHandler
} from './src/middlewares/index.mjs'

// Init express app
const app = express()

// Apply middleware to app
// Handle success and error requests
if (process.env.NODE_ENV !== 'test') {
  app.use(successHandler);
  app.use(errorHandler);
}

// Allow CORS across-the-board
app.use(cors())

// Secure app with various HTTP headers across-the-board
app.use(helmet())

// Sanitize request data like $ . characters
app.use(mongoSanitize())

// Only accept json data
app.use(express.json())

// Parse data with URL-encoded like JSON
app.use(express.urlencoded({ extended: true }))

// Apply rate limiter API by default
app.use(defaultLimiter)

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, httpStatus[404]));
});

// convert error to ApiError, if needed
app.use(centralErrorConverter);

// handle error
app.use(centralErrorHandler);

export default app
