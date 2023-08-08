import { middyfy } from '@libs/lambda';
import { ProductService } from '@services/product.service';

const create = async (_event, _context) => {
  console.log(`Creating new product ${JSON.stringify(_event.body)}`);
  const newProduct = await new ProductService().create(_event.body);
  console.log(`Leaving new product ${JSON.stringify(_event.body)}`);
  return { ...newProduct };
};

export const main = middyfy(create);
