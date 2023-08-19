import { middyfy } from '@libs/lambda';
import { SupplierService } from '@services/supplier.service';

const create = async (_event, _context) => {
  console.log(`Creating new supplier ${JSON.stringify(_event.body)}`);
  const item = await new SupplierService().create(_event.body);
  console.log(`Leaving new supplier ${JSON.stringify(_event.body)}`);
  return { ...item };
};

export const main = middyfy(create);
