import { handlerPath } from '@libs/handler-resolver';
import { AWSFunction } from '@libs/lambda';
import { BaseApiPath } from '@functions/base-api-path';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: `${BaseApiPath.SUPPLIER}/`,
        cors: {
          origin: '*',
        },
      },
    },
  ],
} as AWSFunction;