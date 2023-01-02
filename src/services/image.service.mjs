import { cloudinary } from '../config/cloudinary.mjs'
import { config } from '../validations/index.mjs'

/**
 * Upload file image
 * @param {string} image Image converted to base64 string
 * @returns {object<cloudinary>} Image object created from cloudinary
 */
export const uploadFile = async (image) => cloudinary.uploader.upload(image, {
  upload_preset: config.uploadPreset1,
})

/**
 * Delete file image
 * @param {array<id>} ids Array of file id
 * @returns {object<cloudinary>} Status object from cloudinary
 */
export const deleteFiles = async (ids) => cloudinary.api.delete_resources(ids)
