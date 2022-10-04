import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

// Get current dirname
const __DIRNAME = dirname(fileURLToPath(import.meta.url))

export {
  path,
  __DIRNAME,
}
