/* eslint-disable max-len */
import express from 'express'

import { userController } from '../../controllers/index.mjs'
import { validate, verifyUser } from '../../middlewares/index.mjs'
import { user } from '../../validations/index.mjs'
import { api } from '../../constants/index.mjs'
import { permissions } from '../../config/permissions.mjs'

const {
  VALIDATE_EMAIL,
  CREATE_CLIENT,
  GET_CLIENT,
  GET_CLIENTS,
  DELETE_CLIENT,
} = api.ENDPOINTS.USER
const { ADMIN } = api.ENDPOINTS

const router = express.Router()

router.get(`/${ADMIN}/${GET_CLIENTS}`, verifyUser(permissions.USER.READ_USERS), userController.getAllClients)
router.get(`/${ADMIN}/${GET_CLIENT}`, verifyUser(permissions.USER.READ_USER), userController.getClient)
router.post(`/${ADMIN}/${CREATE_CLIENT}`, verifyUser(permissions.USER.CREATE_USER), userController.createClient)
router.delete(`/${ADMIN}/${DELETE_CLIENT}`, verifyUser(permissions.USER.DELETE_USER), userController.deleteCLient)

router.post(`/${VALIDATE_EMAIL}`, verifyUser(permissions.USER.UPDATE_USER), userController.sendValidationEmail)
router.get(`/${VALIDATE_EMAIL}/t=:token`, validate(user.confirmAccount), userController.confirmAccount)

export default router
