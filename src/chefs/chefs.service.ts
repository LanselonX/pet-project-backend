import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateChefDto } from './dto/create-chef.dto';
import { Role } from 'generated/prisma/enums';

@Injectable()
export class ChefsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userId: number, createChefDto: CreateChefDto) {
    const existChef = await this.databaseService.chef.findUnique({
      where: { userId },
    });
    if (existChef)
      throw new BadRequestException('Chef already exists for this user');

    return this.databaseService.$transaction(async (tx) => {
      const chef = await tx.chef.create({
        data: {
          bio: createChefDto.bio,
          user: { connect: { id: userId } },
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { role: Role.CHEF },
      });

      return chef;
    });
  }
}
