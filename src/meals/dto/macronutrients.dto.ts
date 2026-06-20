import { IsNumber } from 'class-validator';

export class MacronutrientsDto {
  @IsNumber()
  calories: number;

  @IsNumber()
  fat: number;

  @IsNumber()
  carbs: number;

  @IsNumber()
  protein: number;

  @IsNumber()
  fiber: number;

  @IsNumber()
  sugars: number;
}
