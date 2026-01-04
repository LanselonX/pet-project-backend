import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from 'generated/prisma/enums';

export class AuthRegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  //TODO: CHECK THIS SOME LATER
  @IsEnum(Role)
  role: Role;
}
