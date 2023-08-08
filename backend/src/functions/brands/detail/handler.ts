import { middyfy } from '@libs/lambda';
import { BrandService } from '@services/brand.service';

const detailBrand = async (_event, _context) => {
  const id = _event.pathParameters.id;
  console.log(`Getting detail brand. Data: ${id}`);
  const response = await new BrandService().getById(id);
  console.log(`Leaving detail brand. Data: ${id}`);
  return {
    ...response,
  };
};

export const main = middyfy(detailBrand);
