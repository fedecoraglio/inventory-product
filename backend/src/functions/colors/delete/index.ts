import { handlerPath } from '@libs/handler-resolver';
import { AWSFunction } from '@libs/lambda';
import { BaseApiPath } from '@functions/base-api-path';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'delete',
        path: `${BaseApiPath.COLOR}/{id}`,
        cors: {
          origin: '*',
        },
      },
    },
  ],
} as AWSFunction;
