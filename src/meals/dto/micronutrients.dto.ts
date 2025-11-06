import { IsString } from 'class-validator';

export class MicronutrientsDto {
  @IsString()
  omega: string;

  @IsString()
  magnesium: string;

  @IsString()
  vitaminB: string;

  @IsString()
  vitaminD: string;

  @IsString()
  calcium: string;

  @IsString()
  iron: string;

  @IsString()
  potassium: string;

  @IsString()
  sodium: string;
}
