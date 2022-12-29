export default {
  post: {
    summary: 'Reset password of user by token',
    tags: ['Auth CRUD operations'],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: [
              'token',
              'resetPassword',
            ],
            properties: {
              token: {
                type: 'string',
                description: 'token to validate whether reset password request of user is valid or not',
              },
              resetPassword: {
                type: 'string',
                description: 'new password',
              },
            },
            example: {
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsInN0YXR1cyI6ImluYWN0aXZlIiwic3ViIjoiNjM0NzZiZGMyNWU3ZDIyZGZkZWFiMDkyIiwiaWF0IjoxNjY1NjI1MDUyLCJleHAiOjE2NjU2MjY4NTJ9.56gXOWKmEA3oaHhD_Pb_zOWfPBAlVJSsDTj_cBvIXT8',
              resetPassword: 'newpassword123!',
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Success to reset password',
        content: {
          'application/json': {
            example: {
              code: 200,
              message: 'OK',
              data: [],
            },
          },
        },
      },
      400: {
        description: 'Token or reset password not found',
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
        description: 'User not exist or token invalid',
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
