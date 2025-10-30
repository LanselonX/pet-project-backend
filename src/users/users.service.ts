import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

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

    return await this.databaseService.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
      },
    });
  }

  async findOne(email: string) {
    return await this.databaseService.user.findUnique({
      where: { email },
    });
  }
}
