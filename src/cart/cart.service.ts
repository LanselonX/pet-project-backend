import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { Prisma } from 'generated/prisma/client';
import { MealsService } from 'src/meals/meals.service';
import { makeTotalPrice } from 'src/utils/total-price.utils';

@Injectable()
export class CartsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mealsService: MealsService,
  ) {}

  private async findOrCreateCart(userId: number, tx: Prisma.TransactionClient) {
    let cart = await tx.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await tx.cart.create({
        data: { userId },
        include: { items: true },
      });
    }

    return cart;
  }

  async getCart(userId: number, tx: Prisma.TransactionClient) {
    const db = tx ?? this.databaseService;
    const cart = await db.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    return cart;
  }

  async addToCart(userId: number, createCartDto: CreateCartDto) {
    return this.databaseService.$transaction(async (tx) => {
      const cart = await this.findOrCreateCart(userId, tx);

      const mealIds = createCartDto.items.map((i) => i.mealId);

      const meals = await this.mealsService.mealFindMany(mealIds, tx);

      const mealsMap = new Map(meals.map((m) => [m.id, m]));

      const existingItems = await tx.cartItem.findMany({
        where: {
          cartId: cart.id,
          mealId: { in: mealIds },
        },
      });

      const existingItemsMap = new Map(existingItems.map((i) => [i.mealId, i]));

      for (const item of createCartDto.items) {
        const meal = mealsMap.get(item.mealId);
        if (!meal)
          throw new BadRequestException(`Meal ${item.mealId} not found`);

        const existingItems = existingItemsMap.get(item.mealId);

        if (existingItems) {
          await tx.cartItem.update({
            where: { id: existingItems.id },
            data: {
              quantity: existingItems.quantity + item.quantity,
              price: meal.price,
            },
          });
        } else {
          await tx.cartItem.create({
            data: {
              cartId: cart.id,
              mealId: item.mealId,
              quantity: item.quantity,
              price: meal.price,
            },
          });
        }
      }
    });
  }

  async getAllCartItems(userId: number) {
    const cart = await this.databaseService.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { meal: true },
        },
      },
    });

    if (!cart) return null;

    const totalPrice = makeTotalPrice(cart.items);

    return { ...cart, totalPrice };
  }
}
