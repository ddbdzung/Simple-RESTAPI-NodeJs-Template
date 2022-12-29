export const User = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    username: {
      type: 'string',
    },
    email: {
      type: 'string',
      format: 'email',
    },
    role: {
      type: 'string',
    },
    slug: {
      type: 'string',
    },
    status: {
      enum: [
        'inactive',
        'active',
        'banned',
      ],
    },
  },
  example: {
    id: '5ebac534954b54139806c112',
    username: 'fake name',
    email: 'fake@example.com',
    role: 'user',
    slug: 'fake-name',
    status: 'inactive',
  },
}

export const Token = {
  type: 'object',
  properties: {
    access: {
      token: 'string',
      expiresIn: 'number',
    },
    refresh: {
      token: 'string',
      expiresIn: 'number',
    },
  },
  example: {
    access: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsInN0YXR1cyI6ImluYWN0aXZlIiwic3ViIjoiNjM0NzZiZGMyNWU3ZDIyZGZkZWFiMDkyIiwiaWF0IjoxNjY1NjI1MDUyLCJleHAiOjE2NjU2MjY4NTJ9.56gXOWKmEA3oaHhD_Pb_zOWfPBAlVJSsDTj_cBvIXT8',
      expiresAt: 1668652052,
    },
    refresh: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsInN0YXR1cyI6ImluYWN0aXZlIiwic3ViIjoiNjM0NzZiZGMyNWU3ZDIyZGZkZWFiMDkyIiwiaWF0IjoxNjY1NjI1MDUyLCJleHAiOjE2NjU2MjY4NTJ9.56gXOWKmEA3oaHhD_Pb_zOWfPBAlVJSsDTj_cBvIXT8',
      expiresAt: 1671244052,
    },
  },
}
