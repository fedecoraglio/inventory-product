import { middyfy } from '@libs/lambda';
import { BrandService } from '@services/brand.service';

const list = async (_event, _context) => {
  console.log(`Getting brands`);
  const response = await new BrandService().getAll(
  );
  console.log(`Leaving brands`);
  return {
    ...response,
  };
};

export const main = middyfy(list);
