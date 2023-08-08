export default {
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    categoryIds: { type: 'string[]' },
    brandId: { type: 'string' },
  },
  required: ['name', 'brandId'],
} as const;
