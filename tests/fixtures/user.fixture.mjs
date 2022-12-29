/* eslint-disable */
import mongoose from 'mongoose'
import { faker } from '@faker-js/faker/locale/vi'
import slugify from 'slugify'

import { User } from '../../src/models/index.mjs'
import { userService } from '../../src/services/index.mjs'

const password = 'password123!@#'
const hashedPassword = userService.hashPassword(password)
const usernameOne = faker.internet.userName()
const usernameTwo = faker.internet.userName()
const usernameThree = faker.internet.userName()
const adminName = faker.internet.userName()

export const userOne = {
  password,
  _id: mongoose.Types.ObjectId(),
  username: usernameOne,
  email: faker.internet.email().toLocaleLowerCase(),
  role: 'user',
  status: 'inactive',
  slug: slugify(usernameOne, { lower: true }),
}


export const userTwo = {
  password,
  _id: mongoose.Types.ObjectId(),
  username: usernameTwo,
  email: faker.internet.email().toLocaleLowerCase(),
  role: 'user',
  status: 'active',
  slug: slugify(usernameTwo, { lower: true }),
}

export const userThree = {
  password,
  _id: mongoose.Types.ObjectId(),
  username: usernameThree,
  email: faker.internet.email().toLocaleLowerCase(),
  role: 'user',
  status: 'banned',
  slug: slugify(usernameThree, { lower: true }),
}

export const admin = {
  password,
  _id: mongoose.Types.ObjectId(),
  username: adminName,
  email: faker.internet.email().toLocaleLowerCase(),
  role: 'admin',
  status: 'active',
  slug: slugify(adminName, { lower: true }),
}

/**
 * @param {array<object>} users 
 */
export const insertUsers = async users => {
  await User.insertMany(users.map(user => ({ ...user, password: hashedPassword })))
}
