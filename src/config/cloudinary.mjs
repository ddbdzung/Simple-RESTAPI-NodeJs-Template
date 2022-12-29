import { v2 as cloudinary } from 'cloudinary'

import { config } from '../validations/index.mjs'

cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.apiKey,
  api_secret: config.apiSecret,
})

// eslint-disable-next-line import/prefer-default-export
export { cloudinary }
