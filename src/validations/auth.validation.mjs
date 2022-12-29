import Joi from 'joi'

import { password } from './custom.validation.mjs'

export const register = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
}

export const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}

export const findAccount = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
}

export const sendResetPwMail = {
  body: Joi.object().keys({
    token: Joi.string().required(),
    option: Joi.string().required().valid('byEmail', 'byPhoneNumber'),
  }),
}

export const checkResetPwCode = {
  body: Joi.object().keys({
    token: Joi.string().required(),
    secureCode: Joi.string().required().length(6),
  }),
}

export const resetPassword = {
  body: Joi.object().keys({
    token: Joi.string().required(),
    resetPassword: Joi.string().required().custom(password),
  }),
}

export const refreshToken = {
  body: Joi.object().keys({
    refresh: Joi.string().required(),
  }),
}

export const logout = {
  body: Joi.object().keys({
    refresh: Joi.string().required(),
  }),
}
