import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CartsService } from 'src/cart/cart.service';
import { IPaginationOptions } from 'common/types/pagination-options';

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

  async findAllWithPagination({
    userId,
    paginationOptions,
  }: {
    userId: number;
    paginationOptions: IPaginationOptions;
  }) {
    const [orders, totalCount] = await this.databaseService.$transaction([
      this.databaseService.order.findMany({
        where: { userId },
        skip: (paginationOptions.page - 1) * paginationOptions.limit,
        take: paginationOptions.limit,
      }),
      this.databaseService.order.count({
        where: { userId },
      }),
    ]);

    return { totalCount, orders };
  }

  async getOrderById(id: number) {
    return this.databaseService.order.findUnique({
      where: { id },
      include: { items: { include: { meal: true } } },
    });
  }
}
