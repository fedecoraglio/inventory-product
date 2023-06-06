import { handlerPath } from '@libs/handler-resolver';
import { AWSFunction } from '@libs/lambda';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'categories/{id}/categories',
        cors: {
          origin: '*',
        },
      },
    },
  ],
} as AWSFunction;
