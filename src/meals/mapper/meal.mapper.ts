import { Meal } from 'generated/prisma/client';
import { MealResponseeDto } from '../dto/meal-response.dto';

export class MealMapper {
  static toDto(raw: Meal): MealResponseeDto {
    const dtoEntity = new MealResponseeDto();

    dtoEntity.id = raw.id;

    dtoEntity.name = raw.name;

    dtoEntity.description = raw.description;

    return dtoEntity;
  }
}
