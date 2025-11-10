import { IsNumber, IsString } from 'class-validator';

export class CreateChefDto {
  @IsString()
  bio: string;

  @IsNumber()
  userId: number;
}
