import Joi from 'joi'

// eslint-disable-next-line import/prefer-default-export
export const confirmAccount = {
  params: Joi.object().keys({
    token: Joi.string().required(),
  }),
}
