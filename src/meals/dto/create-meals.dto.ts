import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
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

  @IsNumber()
  @Min(50)
  price: number;

  @IsDefined()
  @ValidateNested()
  @Type(() => MacronutrientsDto)
  macronutrients: MacronutrientsDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => MicronutrientsDto)
  micronutrients: MicronutrientsDto;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
