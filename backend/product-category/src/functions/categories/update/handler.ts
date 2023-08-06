import { middyfy } from '@libs/lambda';
import { CategoryService } from '@services/category.service';

const update = async (_event, _context) => {
  const id = _event.pathParameters?.id;
  console.log(`Updating new categories ${id}`);
  const response = await new CategoryService().update(_event.body, id);
  console.log(`Leaving new categories ${id}`);
  return {
    ...response,
  };
};

export const main = middyfy(update);
