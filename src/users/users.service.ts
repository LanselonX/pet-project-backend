import { BadRequestException, Injectable } from '@nestjs/common';
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

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.databaseService.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async getUserIfRefreshTokenIsMatches(refreshToken: string, userId: number) {
    const user = await this.findUserById(userId);

    const userRefreshToken = user?.refreshToken;
    if (!userRefreshToken) {
      throw new BadRequestException('Refresh token not find');
    }

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      userRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number) {
    return this.databaseService.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}
