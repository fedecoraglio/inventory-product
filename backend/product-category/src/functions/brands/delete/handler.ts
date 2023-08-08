import { middyfy } from '@libs/lambda';
import { BrandService } from '@services/brand.service';

const deleteBrand = async (_event, _context) => {
  const id = _event.pathParameters?.id;
  console.log(`Starting deleting brand ${id}`);
  const response = await new BrandService().delete(id);
  console.log(`Leaving deleting brand ${id}`);
  return {
    ...response,
  };
};

export const main = middyfy(deleteBrand);
