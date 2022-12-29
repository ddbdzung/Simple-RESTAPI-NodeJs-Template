import { cloudinary } from '../config/cloudinary.mjs'
import { config } from '../validations/index.mjs'

export const uploadFile = async (image) => cloudinary.uploader.upload(image, {
  upload_preset: config.uploadPreset1,
})

export const deleteFiles = async (ids) => cloudinary.api.delete_resources(ids)
