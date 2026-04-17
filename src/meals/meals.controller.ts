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
  UseGuards,
} from '@nestjs/common';
import { MealsService } from './meals.service';
import { CreateMealsDto } from './dto/create-meals.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { MealType, Role } from 'generated/prisma/enums';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateMealsDto } from './dto/update-meals.dto';
import { MealTypeQuery } from 'common/decorators/meal-type-query.decorator';

@Controller({ path: 'meals' })
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Get()
  getMeals(@MealTypeQuery() type?: MealType[]) {
    return this.mealsService.getMeals(type);
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

  @Get('info/:id')
  @HttpCode(HttpStatus.OK)
  async findByIdWithInfo(@Param('id') id: string) {
    return this.mealsService.findByIdWithInfo(+id);
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
