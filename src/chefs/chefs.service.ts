import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateChefDto } from './dto/create-chef.dto';
import { Role } from 'generated/prisma/enums';
import { UsersService } from 'src/users/users.service';
import { UpdateChefDto } from './dto/update-chef.dto';

@Injectable()
export class ChefsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly usersService: UsersService,
  ) {}

  async create(id: number, createChefDto: CreateChefDto) {
    await this.existingChef(id);

    return this.databaseService.$transaction(async (tx) => {
      const chef = await tx.chef.create({
        data: {
          bio: createChefDto.bio,
          user: { connect: { id } },
          meals: {
            connect: createChefDto.mealIds.map((mealId) => ({ id: mealId })),
          },
        },
        include: { meals: true },
      });
      await this.usersService.update(id, Role.CHEF, tx);

      return chef;
    });
  }

  async update(id: number, updateChefDto: UpdateChefDto) {
    return this.databaseService.chef.update({
      where: { id },
      data: {
        bio: updateChefDto.bio,
        meals: {
          set: updateChefDto.mealIds?.map((mealId) => ({ id: mealId })),
        },
      },
      include: { meals: true },
    });
  }

  async remove(id: number) {
    return this.databaseService.$transaction(async (tx) => {
      const chef = await this.findChef(id);

      await tx.chef.delete({ where: { id } });
      await this.usersService.update(chef.userId, Role.USER, tx);

      return chef;
    });
  }

  private async findChef(id: number) {
    const chef = await this.databaseService.chef.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });
    if (!chef) {
      throw new BadRequestException('Chef not found');
    }
    return chef;
  }

  private async existingChef(id: number) {
    const existChef = await this.databaseService.chef.findUnique({
      where: { id },
    });
    if (existChef) {
      throw new BadRequestException('Chef already exist for this user');
    }
  }
}
