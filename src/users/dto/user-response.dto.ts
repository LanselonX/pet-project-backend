import { IsEmail, IsNumber } from 'class-validator';

export class UserResponseDto {
  @IsNumber()
  id: number;

  @IsEmail()
  email: string;
}
