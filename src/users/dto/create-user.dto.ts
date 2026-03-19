import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'generated/prisma/enums';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(Role)
  role: Role;
}
