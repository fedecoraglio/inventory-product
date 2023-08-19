import { middyfy } from '@libs/lambda';
import { SupplierService } from '@services/supplier.service';

const list = async (_event, _context) => {
  console.log(`Getting suppliers`);
  const response = await new SupplierService().getAll(
  );
  console.log(`Leaving brands`);
  return {
    ...response,
  };
};

export const main = middyfy(list);
