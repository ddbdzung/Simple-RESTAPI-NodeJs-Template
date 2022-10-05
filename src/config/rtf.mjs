// Config stream log file rotating by options
import rfs from 'rotating-file-stream'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

import { getHighResDateTime } from '../helpers/dateToolkit.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

// eslint-disable-next-line no-unused-vars
const generator = (_time, _index) => `${getHighResDateTime()}.log`

// Create stream thread
const stream = rfs.createStream(generator, {
  size: '10M', // rotate every 10 MegaBytes written
  interval: '1d', // rotate daily
  path: join(__dirname, '..', 'logs'),
})

export default stream
