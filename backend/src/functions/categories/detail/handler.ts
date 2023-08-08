import { middyfy } from '@libs/lambda';
import { CategoryService } from '@services/category.service';

const detail = async (_event, _context) => {
  const id = _event.pathParameters.id;
  console.log(`Getting detail category. Data: ${id}`);
  const response = await new CategoryService().getById(id);
  console.log(`Leaving detail category. Data: ${id}`);
  return {
    ...response,
  };
};

export const main = middyfy(detail);
