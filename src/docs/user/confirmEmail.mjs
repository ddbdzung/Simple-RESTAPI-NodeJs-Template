export default {
  post: {
    summary: 'Send email to verify user',
    tags: ['User CRUD operations'],
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
        description: 'Send email successfully or email already sent',
        content: {
          'application/json': {
            example: {
              code: 200,
              message: 'Email sent',
              data: [],
            },
          },
        },
      },
      201: {
        description: 'Resend email successfully',
        content: {
          'application/json': {
            example: {
              code: 201,
              message: 'New email sent',
              data: [],
            },
          },
        },
      },
      400: {
        description: 'Email not exists',
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
      403: {
        description: 'Can not activate active or banned account',
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
