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
    return this.databaseService.$transaction(async (tx) => {
      const meal = await tx.meal.create({
        data: {
          name: createMealsDto.name,
          description: createMealsDto.description,
          ingredients: createMealsDto.ingredients,
          price: createMealsDto.price,
          type: createMealsDto.type,
          macronutrients: { create: createMealsDto.macronutrients },
          micronutrients: { create: createMealsDto.micronutrients },
        },
      });

      if (createMealsDto.imageUrl) {
        const finalUrl = await this.filesService.confirmImage(
          createMealsDto.imageUrl,
          'meal',
          meal.id,
        );
        return tx.meal.update({
          where: { id: meal.id },
          data: { imageUrl: finalUrl },
        });
      }
    });
  }

  async getAllMealsAdmin() {
    return this.databaseService.meal.findMany();
  }

  async getMeals(type?: MealType[]) {
    const meal = this.databaseService.meal.findMany({
      where: {
        ...(type && type.length > 0 ? { type: { hasSome: type } } : {}),
      },
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        macronutrients: {
          select: {
            calories: true,
            fat: true,
            protein: true,
            carbs: true,
          },
        },
      },
    });

    return meal;
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
          update: updateMealsDto.macronutrients,
        },

        micronutrients: {
          update: updateMealsDto.micronutrients,
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

  async mealsCount() {
    return await this.databaseService.meal.count();
  }
}
