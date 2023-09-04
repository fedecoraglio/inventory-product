import { middyfy } from '@libs/lambda';
import { ColorService } from '@services/color.service';

const remove = async (_event, _context) => {
  const id = _event.pathParameters?.id;
  console.log(`Starting deleting color ${id}`);
  const response = await new ColorService().delete(id);
  console.log(`Leaving deleting color ${id}`);
  return {
    ...response,
  };
};

export const main = middyfy(remove);
