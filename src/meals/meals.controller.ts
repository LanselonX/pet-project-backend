import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MealsService } from './meals.service';
import { CreateMealsDto } from './dto/create-meals.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'generated/prisma/enums';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateMealsDto } from './dto/update-meals.dto';
import { FindAllMealsDto } from './dto/find-all-meal.dto';
import { InfinityPaginationResponseDto } from 'common/dto/infinity-pagination-response.dto';
import { Meal } from 'generated/prisma/browser';
import { infinityPagination } from 'common/infinity-pagination';
import { MealMapper } from './mapper/meal.mapper';
import { MealResponseeDto } from './dto/meal-response.dto';

@Controller({ path: 'meals' })
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Get()
  async findAll(
    @Query() query: FindAllMealsDto,
  ): Promise<InfinityPaginationResponseDto<MealResponseeDto | Meal>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const { meals, totalCount } = await this.mealsService.findAllWithPagination(
      {
        paginationOptions: {
          page,
          limit,
        },
      },
    );

    return infinityPagination(
      meals.map((m) => MealMapper.toDto(m)),
      { page, limit },
      totalCount,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createMealsDto: CreateMealsDto) {
    return this.mealsService.create(createMealsDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string) {
    return this.mealsService.findById(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateMealsDto: UpdateMealsDto) {
    return this.mealsService.update(+id, updateMealsDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.mealsService.remove(+id);
  }
}
