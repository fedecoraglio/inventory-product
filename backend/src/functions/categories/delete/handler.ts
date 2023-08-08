import { middyfy } from '@libs/lambda';
import { CategoryService } from '@services/category.service';

const deleteCategory = async (_event, _context) => {
  const id = _event.pathParameters?.id;
  console.log(`Starting deleting category ${id}`);
  const response = await new CategoryService().delete(id);
  console.log(`Leaving deleting category ${id}`);
  return {
    ...response,
  };
};

export const main = middyfy(deleteCategory);
