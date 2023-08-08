import { middyfy } from '@libs/lambda';
import { ProductService } from '@services/product.service';
import { DEFAULT_LIMIT_PAGINATION } from '@dtos/list-item.dto';

const listProduct = async (_event, _context) => {
  console.log(`Getting products`);
  const response = await new ProductService().getAll(
    { query: _event?.queryStringParameters?.query ?? null },
    {
      pageSize:
        _event?.queryStringParameters?.pageSize ?? DEFAULT_LIMIT_PAGINATION,
      page:
        _event?.queryStringParameters?.page ?? 1,
    },
  );
  console.log(`Leaving products`);
  return {
    ...response,
  };
};

export const main = middyfy(listProduct);
