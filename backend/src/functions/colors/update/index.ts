import { handlerPath } from '@libs/handler-resolver';
import { AWSFunction } from '@libs/lambda';
import { BaseApiPath } from '@functions/base-api-path';
import schema from './schema';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'put',
        path: `${BaseApiPath.COLOR}/{id}`,
        request: {
          schemas: {
            'application/json': schema,
          },
        },
        cors: {
          origin: '*',
        },
      },
    },
  ],
} as AWSFunction;
