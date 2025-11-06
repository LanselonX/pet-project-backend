import { IsString } from 'class-validator';

export class MacronutrientsDto {
  @IsString()
  calories: string;

  @IsString()
  fat: string;

  @IsString()
  carbs: string;

  @IsString()
  protein: string;

  @IsString()
  fiber: string;

  @IsString()
  sugars: string;
}
