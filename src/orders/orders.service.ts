import { BadRequestException, Injectable } from '@nestjs/common';
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

      const orderTotalPrice = cart.totalPrice;
      if (!orderTotalPrice) {
        throw new BadRequestException('Error with total price');
      }

      const orderItems = cart.items.map((item) => ({
        mealId: item.mealId,
        quantity: item.quantity,
        price: item.price,
      }));

      const order = await tx.order.create({
        data: {
          userId,
          totalPrice: orderTotalPrice,
          items: { create: orderItems },
        },
        include: { items: true },
      });

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order;
    });
  }
}
