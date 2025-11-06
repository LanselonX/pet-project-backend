import { PartialType } from '@nestjs/mapped-types';
import { CreateMealsDto } from './create-meals.dto';

export class UpdateMealsDto extends PartialType(CreateMealsDto) {}
