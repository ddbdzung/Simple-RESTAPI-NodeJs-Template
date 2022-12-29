// TODO: configure mailer with gmail or something else real
import nodemailer from 'nodemailer'
import logger from '../config/logger.mjs'
import { config } from '../validations/index.mjs'

const transport = nodemailer.createTransport(config.email.smtp);
if (config.nodeEnv !== 'test' || process.env.NODE_ENV !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
// eslint-disable-next-line import/prefer-default-export
export const sendEmail = async (to, opts) => {
  const { subject, text, html } = opts
  const msg = {
    to,
    subject,
    text,
    html,
    from: config.email.from,
  };
  await transport.sendMail(msg);
};
