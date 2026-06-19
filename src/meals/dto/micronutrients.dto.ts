import { IsNumber } from 'class-validator';

export class MicronutrientsDto {
  @IsNumber()
  omega: number;

  @IsNumber()
  magnesium: number;

  @IsNumber()
  vitaminB: number;

  @IsNumber()
  vitaminD: number;

  @IsNumber()
  calcium: number;

  @IsNumber()
  iron: number;

  @IsNumber()
  potassium: number;

  @IsNumber()
  sodium: number;
}
