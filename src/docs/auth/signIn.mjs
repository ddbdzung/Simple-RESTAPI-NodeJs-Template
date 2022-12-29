export default {
  post: {
    summary: 'Login as user',
    tags: ['Auth CRUD operations'],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: [
              'email',
              'password',
            ],
            properties: {
              email: {
                type: 'string',
                format: 'email',
                description: 'must be unique',
              },
              password: {
                type: 'string',
                format: 'password',
              },
            },
            example: {
              email: 'fake@example.com',
              password: 'password1',
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User',
                },
                token: {
                  $ref: '#/components/schemas/Token',
                },
              },
            },
          },
        },
      },
      401: {
        $ref: '#components/responses/Unauthorized',
      },
      500: {
        $ref: '#components/responses/InternalServerError',
      },
    },
  },
}
