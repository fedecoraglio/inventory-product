import { middyfy } from '@libs/lambda';
import { ProductService } from '@services/product.service';
import { DEFAULT_LIMIT_PAGINATION } from '@dtos/list-item.dto';

const listProduct = async (_event, _context) => {
  console.log(`Getting products`);
  const response = await new ProductService().getAll(
    { query: _event?.queryStringParameters?.name ?? null },
    {
      limit: _event?.queryStringParameters?.limit ?? DEFAULT_LIMIT_PAGINATION,
    },
  );
  console.log(`Leaving products`);
  return {
    ...response,
  };
};

export const main = middyfy(listProduct);
