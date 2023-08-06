import type { AWS } from '@serverless/typescript';

// Products
import createProduct from '@functions/products/create';
import listProduct from '@functions/products/list';
import detailProduct from '@functions/products/detail';
import updateProduct from '@functions/products/update';
import deleteProduct from '@functions/products/delete';
// Categories
import createCategory from '@functions/categories/create';
import listCategory from '@functions/categories/list';
import detailCategory from '@functions/categories/detail';
import updateCategory from '@functions/categories/update';
import deleteCategory from '@functions/categories/delete';

const serverlessConfiguration: AWS = {
  service: 'inventory-product',
  frameworkVersion: '3',
  disabledDeprecations: ['CLI_OPTIONS_SCHEMA'],
  plugins: [
    'serverless-esbuild',
    'serverless-offline',
    'serverless-dotenv-plugin',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    httpApi: {
      cors: true,
    },
    stackName: 'dev',
  },

  // import the function via paths
  functions: {
    createProduct,
    listProduct,
    detailProduct,
    updateProduct,
    deleteProduct,
    createCategory,
    listCategory,
    detailCategory,
    updateCategory,
    deleteCategory,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
