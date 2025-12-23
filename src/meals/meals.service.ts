import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateMealsDto } from './dto/create-meals.dto';
import { UpdateMealsDto } from './dto/update-meals.dto';
import { IPaginationOptions } from 'common/types/pagination-options';
import { FileService } from 'src/file/file.service';

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
        type: createMealsDto.type,
        macronutrients: { create: createMealsDto.macronutrients },
        micronutrients: { create: createMealsDto.micronutrients },
        imageUrl: image,
      },
    });
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    const [meals, totalCount] = await this.databaseService.$transaction([
      this.databaseService.meal.findMany({
        skip: (paginationOptions.page - 1) * paginationOptions.limit,
        take: paginationOptions.limit,
      }),
      this.databaseService.meal.count(),
    ]);

    return { totalCount, meals };
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

// return this.databaseService.$transaction(async (tx) => {
//   if (createMealsDto.imageUrl) {
//     const imageUrl = await this.filesService.confirmImage(
//       createMealsDto.imageUrl,
//       'meal',
//     );
//   }

//   const meal = await tx.meal.create({
//     data: {
//       name: createMealsDto.name,
//       description: createMealsDto.description,
//       ingredients: createMealsDto.ingredients,
//       type: createMealsDto.type,
//       macronutrients: { create: createMealsDto.macronutrients },
//       micronutrients: { create: createMealsDto.micronutrients },
//       imageUrl: createMealsDto.imageUrl,
//     },
//   });

//   return meal;
// });
