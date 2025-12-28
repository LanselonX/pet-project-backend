import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateChefDto {
  @IsString()
  bio: string;

  @IsNumber()
  userId: number;

  @IsArray()
  @IsInt({ each: true })
  mealIds: number[];

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
