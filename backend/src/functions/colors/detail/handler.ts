import { middyfy } from '@libs/lambda';
import { ColorService } from '@services/color.service';

const detail = async (_event, _context) => {
  const id = _event.pathParameters.id;
  console.log(`Getting detail color. Data: ${id}`);
  const response = await new ColorService().getById(id);
  console.log(`Leaving detail color. Data: ${id}`);
  return {
    ...response,
  };
};

export const main = middyfy(detail);
