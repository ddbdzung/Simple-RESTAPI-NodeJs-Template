export default {
  post: {
    summary: 'Sign out user',
    tags: ['Auth CRUD operations'],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: [
              'refresh',
            ],
            properties: {
              refresh: {
                type: 'string',
                description: 'Refresh token to sign out session of user',
              },
            },
            example: {
              refresh: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsInN0YXR1cyI6ImluYWN0aXZlIiwic3ViIjoiNjM0NzZiZGMyNWU3ZDIyZGZkZWFiMDkyIiwiaWF0IjoxNjY1NjI1MDUyLCJleHAiOjE2NjU2MjY4NTJ9.56gXOWKmEA3oaHhD_Pb_zOWfPBAlVJSsDTj_cBvIXT8',
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Log out session successfully',
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
        description: 'Access token or refresh token not found in request',
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
      404: {
        description: 'Token not found in database, means session not found',
        content: {
          'application/json': {
            example: {
              code: 404,
              message: 'Not found',
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
