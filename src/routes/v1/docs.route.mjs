import { Router } from 'express'
import { serve, setup } from 'swagger-ui-express'

import docsApi from '../../docs/index.mjs'

const router = Router()

router.use('/', serve, setup(docsApi, { explorer: true }))

export default router
