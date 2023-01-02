import httpStatus from 'http-status'
import bcrypt from 'bcrypt'

import ApiError from '../helpers/ApiError.mjs'
import { User } from '../models/user.model.mjs'

/**
 * Generate hashed password from input value
 * @param {string} password
 * @returns {string} Hashed password
 */
export const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

/**
 * Return logic result after comparing passwords
 * @param {string} pwFromRequest password from request
 * @param {string} pwInDb hashed password in database
 * @returns {boolean} true when password matched
 */
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

/**
 * Get user by user's id
 * @param {string} id user's id
 * @returns {object<mongoose>} user
 */
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

/**
 * Get user by user's email
 * @param {string} email user's email
 * @returns {object<mongoose>} user
 */
export const getUserByEmail = async email => User.findOne({ email })
