import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateMealsDto } from './dto/create-meals.dto';
import { UpdateMealsDto } from './dto/update-meals.dto';

@Injectable()
export class MealsService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createMealsDto: CreateMealsDto) {
    return this.databaseService.meal.create({
      data: {
        name: createMealsDto.name,

        description: createMealsDto.description,

        ingredients: createMealsDto.ingredients,

        type: createMealsDto.type,

        macronutrients: {
          create: createMealsDto.macronutrients,
        },

        micronutrients: {
          create: createMealsDto.micronutrients,
        },
      },
      include: {
        macronutrients: true,
        micronutrients: true,
      },
    });
  }

  findById(id: number) {
    return this.databaseService.meal.findUnique({
      where: { id },
    });
  }

  update(id: number, updateMealsDto: UpdateMealsDto) {
    return this.databaseService.meal.update({
      where: { id },
      data: {
        name: updateMealsDto.name,

        description: updateMealsDto.description,

        ingredients: updateMealsDto.ingredients,

        type: updateMealsDto.type,

        macronutrients: {
          create: updateMealsDto.macronutrients,
        },

        micronutrients: {
          create: updateMealsDto.micronutrients,
        },
      },
      include: {
        macronutrients: true,
        micronutrients: true,
      },
    });
  }

  async remove(id: number) {
    return await this.databaseService.meal.delete({
      where: { id },
    });
  }
}
