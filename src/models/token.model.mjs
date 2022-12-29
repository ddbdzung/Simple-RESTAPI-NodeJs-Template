import mongoose from 'mongoose'

const tokenSchema = mongoose.Schema({
  token: {
    type: String,
    required: true,
    index: true,
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  isBlacklisted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
})

export const Token = mongoose.model('Token', tokenSchema)
