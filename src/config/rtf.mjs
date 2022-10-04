// Set a global index for each lifecycle server deployment
// global.globalFileIndex = 1

// Config stream log file rotating by options
import rfs from 'rotating-file-stream'
import { __DIRNAME, path } from '../constants/index.mjs'
import { getHighResDateTime } from '../helpers/dateToolkit.mjs'

const generator = (time, index) => {
  return `${getHighResDateTime()}.log`
}

// Create stream thread
const stream = rfs.createStream(generator, {
  size: '10M',  // rotate every 10 MegaBytes written
  interval: '1d', // rotate daily
  path: path.join(__DIRNAME, '..', 'logs')
})

export default stream