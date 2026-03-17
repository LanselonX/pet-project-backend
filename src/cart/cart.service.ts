import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class CartsService {
  constructor(private readonly databaseService: DatabaseService) {}

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

  // TODO: in future this needs to be finished
  async clearCart(userId: number, tx: Prisma.TransactionClient) {
    const cart = await this.getCart(userId, tx);

    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    await tx.cart.delete({
      where: { userId },
    });
  }

  private async cartTotalPrice(userId: number, tx: Prisma.TransactionClient) {
    const cart = await this.findOrCreateCart(userId, tx);

    const totalPrice = cart.items.reduce(
      (acc, i) => acc + i.price * i.quantity,
      0,
    );

    return tx.cart.update({
      where: { userId },
      data: { totalPrice },
    });
  }

  async addToCart(userId: number, createCartDto: CreateCartDto) {
    return this.databaseService.$transaction(async (tx) => {
      const cart = await this.findOrCreateCart(userId, tx);

      const mealIds = createCartDto.items.map((i) => i.mealId);

      // TODO: need to take logic from meal service + tx
      const meals = await tx.meal.findMany({
        where: { id: { in: mealIds } },
      });

      const mealsMap = new Map(meals.map((m) => [m.id, m]));

      for (const item of createCartDto.items) {
        const meal = mealsMap.get(item.mealId);
        if (!meal)
          throw new BadRequestException(`Meal ${item.mealId} not found`);

        const existingItems = await tx.cartItem.findUnique({
          where: {
            cartId_mealId: {
              cartId: cart.id,
              mealId: item.mealId,
            },
          },
        });

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

      await this.cartTotalPrice(userId, tx);

      return tx.cart.findUnique({
        where: { userId },
        include: { items: { include: { meal: true } } },
      });
    });
  }

  async getCart(userId: number, tx?: Prisma.TransactionClient) {
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

  async getAllCartItems(userId: number) {
    return await this.databaseService.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { meal: true },
        },
      },
    });
  }
}
