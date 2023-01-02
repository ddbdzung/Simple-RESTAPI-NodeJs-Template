import nodemailer from 'nodemailer'

import logger from './logger.mjs'
import { config } from '../validations/index.mjs'

export const transport = nodemailer.createTransport(config.email.smtp)

if (config.nodeEnv !== 'test' || process.env.NODE_ENV !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}
