export default {
  post: {
    summary: 'Register as user',
    tags: ['Auth CRUD operations'],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: [
              'name',
              'email',
              'password',
            ],
            properties: {
              name: {
                type: 'string',
              },
              email: {
                type: 'string',
                format: 'email',
                description: 'must be unique',
              },
              password: {
                type: 'string',
                format: 'password',
                minLength: 8,
              },
            },
            example: {
              name: 'fake name',
              email: 'fake@example.com',
              password: 'password1',
            },
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Created',
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
      400: {
        $ref: '#components/responses/DuplicatingEmail',
      },
      500: {
        $ref: '#components/responses/InternalServerError',
      },
    },
  },
}
