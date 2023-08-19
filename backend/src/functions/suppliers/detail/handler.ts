import { middyfy } from '@libs/lambda';

import { SupplierService } from '@services/supplier.service';

const detailSupplier = async (_event, _context) => {
  const id = _event.pathParameters.id;
  console.log(`Getting detail supplier. Data: ${id}`);
  const response = await new SupplierService().getById(id);
  console.log(`Leaving detail supplier. Data: ${id}`);
  return {
    ...response,
  };
};

export const main = middyfy(detailSupplier);
