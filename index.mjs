import mongoose from 'mongoose'
import app from './app.mjs'
import logger from './src/config/logger.mjs'
import { getCurrentDateTime } from './src/helpers/dateToolkit.mjs'

const port = process.env.PORT || 2703
let server
const serverErrorHandler = (error) => {
  logger.error(`Error: ${error.message}`)
  if (server) {
    server.close()
  } else {
    process.exit(1)
  }
}

// Config database go here
// Default is MongoDB
const databaseName = process.env?.DB_NAME || 'default'
// Set up your uri connection to MongoDB, default is standalone
const uri = `mongodb://localhost:27017/${databaseName}`
// Set up your options to MongoDB, default is below
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

// Async code go here
mongoose.connect(uri, options).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(port, () => {
    logger.info(`Shop web app deployed at ${getCurrentDateTime()}`)
    logger.info(`Listening to port ${port}`)
  })
}).catch(error => {
  serverErrorHandler(error)
})

// Event handlers go here
// Catch 'unhandledRejection' uncaught error thrown by a promise
process.on('unhandledRejection', serverErrorHandler)
// Catch 'uncaughtException' uncaught error thrown by a random event
process.on('uncaughtException', serverErrorHandler)
// Clean up process after server closed
process.on('exit', () => {
  logger.info('Server closed')
})