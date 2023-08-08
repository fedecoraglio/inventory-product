import { middyfy } from '@libs/lambda';
import { BrandService } from '@services/brand.service';

const create = async (_event, _context) => {
  console.log(`Creating new brand ${JSON.stringify(_event.body)}`);
  const item = await new BrandService().create(_event.body);
  console.log(`Leaving new brand ${JSON.stringify(_event.body)}`);
  return { ...item };
};

export const main = middyfy(create);
