import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'generated/prisma/enums';

export class AuthRegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsNotEmpty()
  password: string;

  //TODO: CHECK THIS SOME LATER
  @IsEnum(Role)
  role: Role;
}
