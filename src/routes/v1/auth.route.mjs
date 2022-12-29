/* eslint-disable max-len */
import express from 'express'

import { authController } from '../../controllers/index.mjs'
import { validate } from '../../middlewares/index.mjs'
import { auth } from '../../validations/index.mjs'
import { api } from '../../constants/index.mjs'

const {
  LOGIN,
  REGISTER,
  FIND_ACCOUNT,
  RESETPW_EMAIL,
  VALIDATE_PWCODE,
  RESET_PASSWORD,
  REFRESH_TOKEN,
  LOGOUT,
  PING,
} = api.ENDPOINTS.AUTH

const router = express.Router()
router.post(`/${REGISTER}`, validate(auth.register), authController.register)
router.post(`/${LOGIN}`, validate(auth.login), authController.login)
router.post(`/${FIND_ACCOUNT}`, validate(auth.findAccount), authController.findAccount)
router.post(`/${RESETPW_EMAIL}`, validate(auth.sendResetPwMail), authController.sendResetPwMail)
router.post(`/${VALIDATE_PWCODE}`, validate(auth.checkResetPwCode), authController.checkResetPwCode)
router.post(`/${RESET_PASSWORD}`, validate(auth.resetPassword), authController.resetPassword)
router.post(`/${REFRESH_TOKEN}`, validate(auth.refreshToken), authController.refreshToken)
router.post(`/${LOGOUT}`, validate(auth.logout), authController.logout)
router.get(`/${PING}`, authController.ping)

export default router
