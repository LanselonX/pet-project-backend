import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthRegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsNotEmpty()
  password: string;
}
