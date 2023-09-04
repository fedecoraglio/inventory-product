import { middyfy } from '@libs/lambda';
import { ColorService } from '@services/color.service';

const update = async (_event, _context) => {
  const id = _event.pathParameters?.id;
  console.log(`Updating color. Data: ${id}`);
  const response = await new ColorService().update(_event.body, id);
  console.log(`Leaving Updating color. Data: ${id}`);
  return {
    ...response,
  };
};

export const main = middyfy(update);
