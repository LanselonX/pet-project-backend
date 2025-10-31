import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'generated/prisma/enums';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const saltOrRounds = 10;

    const existUser = await this.databaseService.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });
    if (existUser) throw new BadRequestException('This user already exist');

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    const user = await this.databaseService.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        // TODO: its for test
        role: createUserDto.role,
      },
    });

    const access_token = this.jwtService.sign({ email: createUserDto.email });

    return { user, access_token };
  }

  async findOne(email: string) {
    return await this.databaseService.user.findUnique({
      where: { email },
    });
  }

  async update(id: number, role: Role) {
    return await this.databaseService.user.update({
      where: { id },
      data: { role },
    });
  }

  async remove(id: number) {
    return await this.databaseService.user.delete({
      where: { id },
    });
  }
}
