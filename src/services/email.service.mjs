import { config } from '../validations/index.mjs'
import { transport } from '../config/nodemailer.mjs'

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
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
