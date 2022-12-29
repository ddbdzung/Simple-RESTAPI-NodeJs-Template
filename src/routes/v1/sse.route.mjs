import express from 'express'

import SSE from '../../helpers/ServerSendEvent.mjs'
import { api } from '../../constants/index.mjs';

const { VALIDATE_EMAIL } = api.ENDPOINTS.SSE

const router = express.Router()

const sseActivateAccount = new SSE();
export { sseActivateAccount };
router.get(`/${VALIDATE_EMAIL}`, sseActivateAccount.init)

export default router
