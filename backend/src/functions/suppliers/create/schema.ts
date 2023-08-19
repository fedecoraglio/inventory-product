export default {
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    email: { type: 'string' },
    phoneNumber: { type: 'string' },
  },
  required: ['name', 'email'],
} as const;
