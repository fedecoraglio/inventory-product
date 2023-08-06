import { middyfy } from '@libs/lambda';
import { CategoryService } from '@services/category.service';

const create = async (_event, _context) => {
  console.log(`Creating new category`);
  const resp = await new CategoryService().create(_event.body);
  console.log(`Leaving new category`);
  return { ...resp };
};

export const main = middyfy(create);
