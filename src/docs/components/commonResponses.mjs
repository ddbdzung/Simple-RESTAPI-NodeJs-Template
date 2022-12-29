export const DuplicatingEmail = {
  description: 'Email already taken',
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/Error',
      },
      example: {
        code: 400,
        message: 'Email already taken',
        data: [],
      },
    },
  },
}

export const InternalServerError = {
  description: 'Internal server error',
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/Error',
      },
      example: {
        code: 500,
        message: 'Internal server error',
        data: [],
      },
    },
  },
}

export const Unauthorized = {
  description: 'Unauthorized',
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/Error',
      },
      example: {
        code: 401,
        message: 'Unauthorized',
        data: [],
      },
    },
  },
}

export const Forbidden = {
  description: 'Forbidden',
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/Error',
      },
    },
  },
}
