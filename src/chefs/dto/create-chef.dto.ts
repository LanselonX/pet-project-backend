import { IsArray, IsInt, IsNumber, IsString } from 'class-validator';

export class CreateChefDto {
  @IsString()
  bio: string;

  @IsNumber()
  userId: number;

  @IsArray()
  @IsInt({ each: true })
  mealIds: number[];
}
