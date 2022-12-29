export const _id = {
  type: 'string',
  description: 'An id of a contact',
  example: '63390ffb769306d131512c00',
}

export const Error = {
  type: 'object',
  properties: {
    code: {
      type: 'number',
    },
    message: {
      type: 'string',
    },
    data: {
      AnyValue: {
        nullable: true,
        description: 'Can be any value, default is []',
      },
    },
  },
}

export const Token = {
  type: 'string',
  description: 'An token with sub payload contains id',
  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsInN0YXR1cyI6ImluYWN0aXZlIiwic3ViIjoiNjM0NzZiZGMyNWU3ZDIyZGZkZWFiMDkyIiwiaWF0IjoxNjY1NjI1MDUyLCJleHAiOjE2NjU2MjY4NTJ9.56gXOWKmEA3oaHhD_Pb_zOWfPBAlVJSsDTj_cBvIXT8',
}

export const ResponseError = {
  type: 'object',
  properties: {
    code: {
      type: 'string',
      description: 'code of error',
    },
    message: {
      type: 'string',
    },
  },
}

export const ResponseSuccess = {
  type: 'object',
  properties: {
    code: {
      type: 'string',
      description: 'code of response',
    },
    message: {
      type: 'string',
    },
    data: {
      allOf: [
        {
          type: 'array',
        },
        {
          type: 'object',
        },
      ],
    },
  },
}
