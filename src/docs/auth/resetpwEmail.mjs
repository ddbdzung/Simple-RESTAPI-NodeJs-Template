export default {
  post: {
    summary: 'Send reset password code by email to user\'s mail box',
    tags: ['Auth CRUD operations'],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: [
              'token',
              'option',
            ],
            properties: {
              token: {
                type: 'string',
                description: 'token to validate if reset password request of user is valid',
              },
              option: {
                type: 'string',
                enum: ['byEmail', 'byPhoneNumber'],
                description: 'reset password method',
              },
            },
            example: {
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsInN0YXR1cyI6ImluYWN0aXZlIiwic3ViIjoiNjM0NzZiZGMyNWU3ZDIyZGZkZWFiMDkyIiwiaWF0IjoxNjY1NjI1MDUyLCJleHAiOjE2NjU2MjY4NTJ9.56gXOWKmEA3oaHhD_Pb_zOWfPBAlVJSsDTj_cBvIXT8',
              option: 'byEmail',
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
        description: 'Token not found',
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
        description: 'Token not exist or invalid or user not exist',
        content: {
          'application/json': {
            example: {
              code: 403,
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
