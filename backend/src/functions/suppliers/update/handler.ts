import { middyfy } from '@libs/lambda';
import { SupplierService } from '@services/supplier.service';

const update = async (_event, _context) => {
  const id = _event.pathParameters?.id;
  console.log(`Updating supplier. Data: ${id}`);
  const response = await new SupplierService().update(_event.body, id);
  console.log(`Leaving Updating supplier. Data: ${id}`);
  return {
    ...response,
  };
};

export const main = middyfy(update);
