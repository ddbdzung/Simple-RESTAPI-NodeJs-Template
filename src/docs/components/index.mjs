import * as commonSchemas from './commonSchemas.mjs'
import * as userSchema from './userSchema.mjs'
import * as commonResponses from './commonResponses.mjs'

export const components = {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
    },
  },
  schemas: {
    ...commonSchemas,
    ...userSchema,
  },
  responses: {
    ...commonResponses,
  },
}
