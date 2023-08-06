import { middyfy } from '@libs/lambda';
import { DEFAULT_LIMIT_PAGINATION } from '@dtos/list-item.dto';
import { CategoryService } from '@services/category.service';

const list = async (_event, _context) => {
  console.log(`Getting categories`);
  const response = await new CategoryService().getAll(
    { query: _event?.queryStringParameters?.name ?? null },
    {
      limit: _event?.queryStringParameters?.limit ?? DEFAULT_LIMIT_PAGINATION,
    },
  );
  console.log(`Leaving categories`);
  return {
    ...response,
  };
};

export const main = middyfy(list);
