// Config stream log file rotating by options
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

import rfs from 'rotating-file-stream'
import { getHighResDateTime } from '../helpers/dateToolkit.mjs'

const generator = (time, index) => {
  return `${getHighResDateTime()}.log`
}

// Create stream thread
const stream = rfs.createStream(generator, {
  size: '10M',  // rotate every 10 MegaBytes written
  interval: '1d', // rotate daily
  path: path.join(__dirname, '..', 'logs')
})

export default stream
