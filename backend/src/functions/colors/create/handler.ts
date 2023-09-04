import { middyfy } from '@libs/lambda';
import { ColorService } from '@services/color.service';

const create = async (_event, _context) => {
  console.log(`Creating new color ${JSON.stringify(_event.body)}`);
  const item = await new ColorService().create(_event.body);
  console.log(`Leaving new color ${JSON.stringify(_event.body)}`);
  return { ...item };
};

export const main = middyfy(create);
