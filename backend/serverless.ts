import type { AWS } from '@serverless/typescript';

// Brands
import brandCreate from '@functions/brands/create';
import brandList from '@functions/brands/list';
import brandDetail from '@functions/brands/detail';
import brandUpdate from '@functions/brands/update';
import brandDelete from '@functions/brands/delete';
// Products
import productCreate from '@functions/products/create';
import productList from '@functions/products/list';
import productDetail from '@functions/products/detail';
import productUpdate from '@functions/products/update';
import productDelete from '@functions/products/delete';
// Categories
import categoryCreate from '@functions/categories/create';
import categoryList from '@functions/categories/list';
import categoryDetail from '@functions/categories/detail';
import categoryUpdate from '@functions/categories/update';
import categoryDelete from '@functions/categories/delete';

const serverlessConfiguration: AWS = {
  service: 'inventory-product-backend',
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
    brandCreate,
    brandList,
    brandDetail,
    brandUpdate,
    brandDelete,
    productCreate,
    productList,
    productDetail,
    productUpdate,
    productDelete,
    categoryCreate,
    categoryList,
    categoryDetail,
    categoryUpdate,
    categoryDelete,
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