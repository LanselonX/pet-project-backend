import { Type } from 'class-transformer';
import { IsDefined, IsEnum, IsString, ValidateNested } from 'class-validator';
import { MealType } from 'generated/prisma/enums';
import { MacronutrientsDto } from './macronutrients.dto';
import { MicronutrientsDto } from './micronutrients.dto';

export class CreateMealsDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  ingredients: string;

  @IsEnum(MealType, { each: true })
  type: MealType[];

  @IsDefined()
  @ValidateNested()
  @Type(() => MacronutrientsDto)
  macronutrients: MacronutrientsDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => MicronutrientsDto)
  micronutrients: MicronutrientsDto;
}
