/* eslint-disable max-len */
import express from 'express'

import { userController } from '../../controllers/index.mjs'
import { validate, verifyUser } from '../../middlewares/index.mjs'
import { user } from '../../validations/index.mjs'
import { api } from '../../constants/index.mjs'
import { permissions } from '../../config/permissions.mjs'

const {
  VALIDATE_EMAIL,
} = api.ENDPOINTS.USER

const router = express.Router()

router.post(`/${VALIDATE_EMAIL}`, verifyUser(permissions.USER.UPDATE_USER), userController.sendValidationEmail)
router.get(`/${VALIDATE_EMAIL}/t=:token`, validate(user.confirmAccount), userController.confirmAccount)

export default router
