import httpStatus from 'http-status'
import bcrypt from 'bcrypt'

import ApiError from '../helpers/ApiError.mjs'
import { User } from '../models/user.model.mjs'
import { USER } from '../constants/role.mjs'

export const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const comparePassword = (pwFromRequest, pwInDb) => bcrypt.compareSync(pwFromRequest, pwInDb)

/**
 * True when email has been already assigned
 * @param {String} email
 * @returns {Boolean}
 */
export const isEmailTaken = async email => {
  const user = await User.findOne({ email })
  return !!user
}

/**
 * @param {Object} username: String | emai: String | password: String
 * @returns {Object} user
 */
export const createUser = async doc => {
  // Promise.resolve() to fix ts(80007) false positive
  const isEmailExisted = await Promise.resolve(isEmailTaken(doc.email))
  if (isEmailExisted) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken')
  }

  const cleanDoc = {
    ...doc,
    password: hashPassword(doc.password),
  }
  return User.create(cleanDoc)
}

export const getUserById = async id => User.findById(id)

/**
 * @param {string} id objectId
 * @param {object} update fields to update
 * @returns {object<mongoose>} result
 */
export const updateUserById = async (id, update) => User.findByIdAndUpdate(id, update)

/**
 * Check if a password is valid or not
 * @param {object} user mongoose object
 * @param {string} password requested password from client
 * @returns {Boolean} True: Password match
 */
export const isPasswordMatch = (user, password) => comparePassword(password, user.password)

export const getAllClient = async () => User.find(
  { role: USER },
  'username email phoneNumber gender status createdAt updatedAt address',
).lean()

export const getClientById = async id => User.findById(id, 'username email phoneNumber gender status createdAt updatedAt address').lean()

export const getUserByEmail = async email => User.findOne({ email })

export const deleteCLientById = async id => User.findByIdAndDelete(id)
