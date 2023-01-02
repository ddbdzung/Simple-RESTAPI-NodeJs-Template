import mongoose from 'mongoose'
import slugify from 'slugify'

import { role, gender, status } from '../constants/index.mjs'

const userSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: [8, 'Password must be at least 8 characters'],
    private: true,
  },
  // Used in find account API to send reset pw code by email
  findAccountToken: {
    type: String,
  },
  resetPwCode: {
    type: String,
    length: [6, 'reset password code length must be 6'],
  },
  resetPwToken: {
    type: String,
  },
  // Unit time: milisecond
  resetPwIssued: {
    type: String,
  },
  // number of request send to server, to limit bruteforce reset password
  resetPwRate: {
    type: Number,
    default: 0,
    min: 0,
    max: [5, 'limit max requests'],
  },
  // username: Dang Duc Bao Dzung => slug: Dang-Duc-Bao-Dung
  slug: {
    type: String,
  },
  status: {
    type: String,
    default: status.INACTIVE,
    enum: Object.values(status),
  },
  // Created when user validates account
  activateToken: {
    type: String,
  },
  address: {
    type: String,
    minLength: [30, 'Address must be longer than 30 characters'],
  },
  phoneNumber: {
    type: String,
    maxLength: [11, 'Phone number must be shorter than 12 characters'],
  },
  gender: {
    type: String,
    enum: Object.values(gender),
  },
  // Populate to role model by role name
  role: {
    type: String,
    enum: role.roleArr,
    default: role.USER,
  },
}, {
  timestamps: true,
  // So `res.json()` and other `JSON.stringify()` functions include virtuals
  toJSON: { virtuals: true },
  // So `console.log()` and other functions that use `toObject()` include virtuals
  toObject: { virtuals: true },
})

/**
 * * Js code
 * `
 *  const x = await User.findById({ _id: '63472aaabb3e2e6764f03f4c' })
      .populate({
        path: 'rolePermissions',
        select: 'permission',
      })
    console.log(x.rolePermissions[0].permission)
  `
 * * Sample of virtual populate one-to-many
 */
userSchema.virtual('rolePermissions', {
  localField: 'role', // userSchema field which is foregin key
  ref: 'Role', // The model to use
  foreignField: 'name', // roleSchema field which is temporary primary key
})

userSchema.methods.rolePopulating = async function (projection) {
  const userPopulate = this.populate({
    path: 'rolePermissions',
    select: projection,
  })
  return userPopulate;
};

userSchema.pre('save', async function (next) {
  this.slug = slugify(this.fullname, { lower: true })
  next()
})

export const User = mongoose.model('User', userSchema)
