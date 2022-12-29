export default {
  post: {
    summary: 'Find user to send reset password email',
    tags: ['Auth CRUD operations'],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: [
              'email',
            ],
            properties: {
              email: {
                type: 'string',
                format: 'email',
                description: 'must be unique',
              },
            },
            example: {
              email: 'fake@example.com',
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Success to find user, send token to client',
        content: {
          'application/json': {
            example: {
              code: 200,
              message: 'OK',
              data: {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsInN0YXR1cyI6ImluYWN0aXZlIiwic3ViIjoiNjM0NzZiZGMyNWU3ZDIyZGZkZWFiMDkyIiwiaWF0IjoxNjY1NjI1MDUyLCJleHAiOjE2NjU2MjY4NTJ9.56gXOWKmEA3oaHhD_Pb_zOWfPBAlVJSsDTj_cBvIXT8',
              },
            },
          },
        },
      },
      400: {
        description: 'User not exist',
        content: {
          'application/json': {
            example: {
              code: 400,
              message: 'Email not exists',
              data: [],
            },
          },
        },
      },
      401: {
        description: 'User account is inactive',
        content: {
          'application/json': {
            example: {
              code: 401,
              message: 'Unauthorized',
              data: [],
            },
          },
        },
      },
      500: {
        $ref: '#components/responses/InternalServerError',
      },
    },
  },
}
