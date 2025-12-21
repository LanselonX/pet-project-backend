import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'generated/prisma/enums';
import { Prisma } from 'generated/prisma/browser';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.databaseService.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        // TODO: its for test
        role: createUserDto.role,
      },
      select: {
        id: true,
        email: true,
      },
    });
  }

  async findUserById(id: number) {
    return await this.databaseService.user.findUnique({
      where: { id },
    });
  }

  async findOne(email: string) {
    return await this.databaseService.user.findUnique({
      where: { email },
    });
  }

  async validateById(id: number) {
    return await this.databaseService.user.findUnique({
      where: { id },
      select: { id: true, role: true },
    });
  }

  async update(id: number, role: Role, tx?: Prisma.TransactionClient) {
    const db = tx ?? this.databaseService;
    return await db.user.update({
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
