import { middyfy } from '@libs/lambda';
import { BrandService } from '../../../services/brand.service';

const update = async (_event, _context) => {
  const id = _event.pathParameters?.id;
  console.log(`Updating brand. Data: ${id}`);
  const response = await new BrandService().update(_event.body, id);
  console.log(`Leaving Updating brand. Data: ${id}`);
  return {
    ...response,
  };
};

export const main = middyfy(update);
