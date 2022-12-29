import { V1, ENDPOINTS } from './api.mjs'
import { config } from '../validations/index.mjs'

const validateURL = token => ((config.nodeEnv === 'production')
  ? `${config.host}${V1}/${ENDPOINTS.USER.BASE}/${ENDPOINTS.USER.VALIDATE_EMAIL}/t=${token}`
  : `http://${config.host}:${config.port}${V1}/${ENDPOINTS.USER.BASE}/${ENDPOINTS.USER.VALIDATE_EMAIL}/t=${token}`)

export const verifyAccount = token => ({
  subject: 'Verify your Simple Web\'s account',
  text: `Click to this link ${validateURL(token)} to verify your account`,
  html: `
  <div style="display: flex; justify-content: center;">
  <a href="${validateURL(token)}"
  style="display: inline-block; 
  background-color: #04AA6D;
  text-decoration: none;
  color: #fff;
  padding: 16px 12px;
  border-radius: 12px;
  font-size: 20px;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;">
    Verify your account
  </a>
</div>
  `,
})

export const resetPw = code => ({
  subject: 'Reset your Simple Web\'s password',
  text: `Copy this OTP code ${code} to reset your password. If there are some mistake, ignore this email.`,
  html: `
  <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;">
  <div style="margin: 8px 8px; font-size: 16px;">
    Use OTP code below to reset your password.
  </div>
  <div style="margin: 8px 8px; font-size: 12px;">
    If there are some mistake, ignore this email.
  </div>
  <div
  style="
  background-color: #04AA6D;
  width: 200px;
  text-align: center;
  color: #fff;
  padding: 16px 12px;
  border-radius: 12px;
  font-size: 20px;
  "
  >
    <strong>${code}</strong>
  </div>
</div>
  `,
})
