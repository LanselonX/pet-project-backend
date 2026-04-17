import { ParseArrayPipe, Query } from '@nestjs/common';

export const MealTypeQuery = () =>
  Query(
    'type',
    new ParseArrayPipe({ items: String, separator: ',', optional: true }),
  );
