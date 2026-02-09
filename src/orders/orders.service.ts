import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CartsService } from 'src/cart/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cartsService: CartsService,
  ) {}

  async confirmOrder(userId: number) {
    return this.databaseService.$transaction(async (tx) => {
      const cart = await this.cartsService.getCart(userId, tx);

      const orderItems = cart.items.map((item) => ({
        mealId: item.mealId,
        quantity: item.quantity,
        price: item.price,
      }));

      const totalPrice = orderItems.reduce(
        (acc, i) => acc + i.price * i.quantity,
        0,
      );

      const order = await tx.order.create({
        data: {
          userId,
          totalPrice,
          items: { create: orderItems },
        },
        include: { items: true },
      });
      console.log('order is', order);

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order;
    });
  }
}
