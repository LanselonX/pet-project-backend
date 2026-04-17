import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateMealsDto } from './dto/create-meals.dto';
import { UpdateMealsDto } from './dto/update-meals.dto';
import { FileService } from 'src/file/file.service';
import { MealType, Prisma } from 'generated/prisma/client';

@Injectable()
export class MealsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly filesService: FileService,
  ) {}

  async create(createMealsDto: CreateMealsDto) {
    // TODO: update this logic, mb transaction
    const randomInt = Math.floor(Math.random() * 5555);

    const image = createMealsDto.imageUrl
      ? await this.filesService.confirmImage(
          createMealsDto.imageUrl,
          'meal',
          randomInt,
        )
      : null;

    return this.databaseService.meal.create({
      data: {
        name: createMealsDto.name,
        description: createMealsDto.description,
        ingredients: createMealsDto.ingredients,
        price: createMealsDto.price,
        type: createMealsDto.type,
        macronutrients: { create: createMealsDto.macronutrients },
        micronutrients: { create: createMealsDto.micronutrients },
        imageUrl: image,
      },
    });
  }

  async getMeals(type?: MealType[]) {
    const meals = this.databaseService.meal.findMany({
      where: {
        ...(type && type.length > 0 ? { type: { hasSome: type } } : {}),
      },
    });
    return meals;
  }

  findById(id: number) {
    return this.databaseService.meal.findUnique({
      where: { id },
    });
  }

  findByIdWithInfo(id: number) {
    return this.databaseService.meal.findUnique({
      where: { id },
      include: {
        macronutrients: true,
        micronutrients: true,
      },
    });
  }

  // TODO: usage only in cart service
  mealFindMany(ids: number[], tx: Prisma.TransactionClient) {
    return tx.meal.findMany({
      where: { id: { in: ids } },
      select: { id: true, price: true },
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
