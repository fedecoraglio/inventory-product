import { middyfy } from '@libs/lambda';
import { SupplierService } from '@services/supplier.service';

const deleteBrand = async (_event, _context) => {
  const id = _event.pathParameters?.id;
  console.log(`Starting deleting supplier ${id}`);
  const response = await new SupplierService().delete(id);
  console.log(`Leaving deleting supplier ${id}`);
  return {
    ...response,
  };
};

export const main = middyfy(deleteBrand);
