import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { MealsService } from 'src/meals/meals.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class CartsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mealsService: MealsService,
  ) {}

  private async findOrCreateCart(userId: number) {
    let cart = await this.databaseService.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await this.databaseService.cart.create({
        data: { userId },
        include: { items: true },
      });
    }

    return cart;
  }

  async addToCart(userId: number, createCartDto: CreateCartDto) {
    const cart = await this.findOrCreateCart(userId);

    for (const items of createCartDto.items) {
      const meal = await this.mealsService.findById(items.mealId);
      if (!meal)
        throw new BadRequestException(`Meal ${createCartDto.items} not found`);

      const existingItems = await this.databaseService.cartItem.findFirst({
        where: { cartId: cart.id, mealId: items.mealId },
      });

      if (existingItems) {
        await this.databaseService.cartItem.update({
          where: { id: existingItems.id },
          data: {
            quantity: existingItems.quantity + items.quantity,
            price: meal.price,
          },
        });
      } else {
        await this.databaseService.cartItem.create({
          data: {
            cartId: cart.id,
            mealId: items.mealId,
            quantity: items.quantity,
            price: meal.price,
          },
        });
      }
    }

    return this.databaseService.cart.findUnique({
      where: { userId },
      include: { items: { include: { meal: true } } },
    });
  }

  async getCart(userId: number, tx?: Prisma.TransactionClient) {
    const db = tx ?? this.databaseService;
    const cart = await db.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      throw new BadRequestException('Cart not found');
    }

    if (cart.items.length === 0) {
      throw new BadRequestException('Cart is Empty');
    }

    return cart;
  }
}
