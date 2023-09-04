import { middyfy } from '@libs/lambda';
import { ColorService } from '@services/color.service';

const list = async (_event, _context) => {
  console.log(`Getting colors`);
  const response = await new ColorService().getAll(
  );
  console.log(`Leaving colors`);
  return {
    ...response,
  };
};

export const main = middyfy(list);
