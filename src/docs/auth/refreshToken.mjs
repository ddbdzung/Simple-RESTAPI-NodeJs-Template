export default {
  post: {
    summary: 'Reset access token and refresh token for user',
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
              },
            },
            example: {
              refresh: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsInN0YXR1cyI6ImluYWN0aXZlIiwic3ViIjoiNjM0NzZiZGMyNWU3ZDIyZGZkZWFiMDkyIiwiaWF0IjoxNjY1NjI1MDUyLCJleHAiOjE2NjU2MjY4NTJ9.56gXOWKmEA3oaHhD_Pb_zOWfPBAlVJSsDTj_cBvIXT8@example.com',
            },
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Create new access token and refresh token',
        content: {
          'application/json': {
            example: {
              code: 201,
              message: 'Created',
              data: {
                access: {
                  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsInN0YXR1cyI6ImluYWN0aXZlIiwic3ViIjoiNjM0NzZiZGMyNWU3ZDIyZGZkZWFiMDkyIiwiaWF0IjoxNjY1NjI1MDUyLCJleHAiOjE2NjU2MjY4NTJ9.56gXOWKmEA3oaHhD_Pb_zOWfPBAlVJSsDTj_cBvIXT8',
                  expiresAt: 1668652052,
                },
                refresh: {
                  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsInN0YXR1cyI6ImluYWN0aXZlIiwic3ViIjoiNjM0NzZiZGMyNWU3ZDIyZGZkZWFiMDkyIiwiaWF0IjoxNjY1NjI1MDUyLCJleHAiOjE2NjU2MjY4NTJ9.56gXOWKmEA3oaHhD_Pb_zOWfPBAlVJSsDTj_cBvIXT8',
                  expiresAt: 1671244052,
                },
              },
            },
          },
        },
      },
      400: {
        description: 'Refresh token or access token not found',
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
        description: 'Unauthorized by invalid refresh token or malicious action or blacklist user or banned user',
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
        description: 'Detects malicious action, requires user to re-login again',
        content: {
          'application/json': {
            example: {
              code: 403,
              message: 'Malicious action detected! Please authenticate your account!',
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
