export default {
  get: {
    summary: 'Verify user by token',
    tags: ['User CRUD operations'],
    description: 'Confirm user by token',
    parameters: [
      {
        name: 'token',
        in: 'path',
        description: 'Activate token of user',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      200: {
        description: "Activate user successfully, remove 'activateToken' of user",
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
      401: {
        description: 'Invalid Token malformed or expired',
        content: {
          'application/json': {
            example: {
              code: 400,
              message: 'Invalid Token',
              data: [],
            },
          },
        },
      },
      403: {
        description: 'Forbidden since user dont have activateToken in db or user status != inactive',
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
