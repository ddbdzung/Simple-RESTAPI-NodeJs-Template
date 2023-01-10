import mongoose from 'mongoose'

import app from './app.mjs'
import logger from './src/config/logger.mjs'
import { getCurrentDateTime } from './src/helpers/dateToolkit.mjs'
import { adminAccount, adminRole, userRole } from './src/config/setup.mjs'
import { Role, User } from './src/models/index.mjs'

// Config database go here
// Default is MongoDB
const databaseName = process.env.DB_NAME || 'default'
// Set up your uri connection to MongoDB, default is standalone
let uri
mongoose.set('strictQuery', false)
if (process.env.NODE_ENV === 'development') {
  uri = `mongodb://127.0.0.1:27017/${databaseName}`
} else if (process.env.NODE_ENV === 'production') {
  uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@demo-extension-pems.zeqcit3.mongodb.net/?retryWrites=true&w=majority`
}
// Set up your options to MongoDB, default is below
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

const port = +process.env.PORT || 2703
let server

const serverErrorHandler = (error) => {
  logger.error(error)
  if (server) {
    server.close()
  } else {
    process.exit(1)
  }
}

const checkAdminRoleExists = Role.find({ name: adminRole.name })
const checkUserRoleExists = Role.find({ name: userRole.name })
const checkAdminAccountExists = User.find({ email: adminAccount.email })

// Async code go here
mongoose.connect(uri, options).then(async () => {
  logger.info('Connected to MongoDB');
  try {
    const adminRoles = await checkAdminRoleExists
    const userRoles = await checkUserRoleExists
    const adminAccounts = await checkAdminAccountExists

    if (adminRoles.length <= 0 && userRoles.length <= 0) {
      Role.create(adminRole, userRole)
      logger.info('Created roles')
    }
    if (adminAccounts.length <= 0) {
      User.create(adminAccount)
      logger.info('Created admin account')
    }

    server = app.listen(port, () => {
      logger.info(`SGFM WebAPI deployed at ${getCurrentDateTime()}`)
      logger.info(`Listening to port ${port}`)
    })
  } catch (e) {
    throw new Error(e)
  }
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
process.on('SIGTERM', () => {
  logger.info('SIGTERM received')
  if (server) {
    server.close()
  }
})
