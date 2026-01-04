import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { MealsService } from 'src/meals/meals.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mealsService: MealsService,
  ) {}

  async create(userId: number, createOrderDto: CreateOrderDto) {
    const mealIds = createOrderDto.items.map(({ mealId }) => mealId);

    const meals = await this.mealsService.findMany(mealIds);
    const mealsMap = new Map(meals.map((meal) => [meal.id, meal]));

    const items = createOrderDto.items.map(({ mealId, quantity }) => {
      const meal = mealsMap.get(mealId);
      if (!meal) {
        throw new BadRequestException(`Meal with ${mealId} not found!`);
      }
      return {
        mealId,
        quantity,
        price: meal.price,
      };
    });

    // TODO: More checks are needed to ensure the price doesn't change
    const totalPrice = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

    return this.databaseService.order.create({
      data: {
        userId,
        totalPrice,
        items: { create: items },
      },
      include: { items: true },
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.databaseService.order.update({
      where: { id },
      data: {
        status: updateOrderDto.status,
      },
    });
  }

  async remove(id: number) {
    return await this.databaseService.order.delete({
      where: { id },
    });
  }
}
