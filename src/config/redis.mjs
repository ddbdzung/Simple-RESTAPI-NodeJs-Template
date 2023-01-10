import { createClient } from 'redis'

import { config } from '../validations/index.mjs'
import logger from './logger.mjs'

const redisClient = async () => {
  try {
    const client = createClient({
      url: config.redisUrl,
    })
    client.on('error', err => {
      logger.error(err)
      client.disconnect()
    })
    client.on('ready', () => {
      logger.info('Connected to redis')
    })

    await client.connect()
  } catch (err) {
    logger.error(err)
  }
}

export default redisClient
