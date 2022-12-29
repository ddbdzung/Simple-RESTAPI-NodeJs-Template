export default {
  post: {
    summary: 'Check reset password code',
    tags: ['Auth CRUD operations'],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: [
              'token',
              'secureCode',
            ],
            properties: {
              token: {
                type: 'string',
                description: 'token to validate whether reset password request of user is valid or not',
              },
              secureCode: {
                type: 'string',
                pattern: '/^[0-9]{6}$/',
                description: 'secure code to validate whether reset password request of user is valid or not',
              },
            },
            example: {
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsInN0YXR1cyI6ImluYWN0aXZlIiwic3ViIjoiNjM0NzZiZGMyNWU3ZDIyZGZkZWFiMDkyIiwiaWF0IjoxNjY1NjI1MDUyLCJleHAiOjE2NjU2MjY4NTJ9.56gXOWKmEA3oaHhD_Pb_zOWfPBAlVJSsDTj_cBvIXT8',
              secureCode: '123456',
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Success to send email or resend email',
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
        description: 'Token or secureCode not found',
        content: {
          'application/json': {
            example: {
              code: 400,
              message: 'Bad request',
              data: [],
            },
          },
        },
      },
      401: {
        description: 'User not exist or token expired or code not match',
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
      403: {
        description: 'Reach limit request or spam correct code',
        content: {
          'application/json': {
            example: {
              code: 403,
              message: 'Forbidden',
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
