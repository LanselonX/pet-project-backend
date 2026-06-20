import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CartsService } from 'src/cart/cart.service';
import { IPaginationOptions } from 'common/types/pagination-options';
import { makeTotalPrice } from 'src/utils/total-price.utils';
import { OrderStatus } from 'generated/prisma/enums';

@Injectable()
export class OrdersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cartsService: CartsService,
  ) {}

  async confirmOrder(userId: number) {
    return this.databaseService.$transaction(async (tx) => {
      const cart = await this.cartsService.getCart(userId, tx);

      const orderTotalPrice = makeTotalPrice(cart.items);

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

  async getAllOrdersAdmin() {
    return this.databaseService.order.findMany();
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

  async getOrderById(id: number, userId: number) {
    return this.databaseService.order.findUnique({
      where: { id, userId },
      include: { items: { include: { meal: true } } },
    });
  }

  async getOrderByIdAdmin(id: number) {
    return await this.databaseService.order.findUnique({
      where: { id },
      include: { items: { include: { meal: true } } },
    });
  }

  async updateOrderStatus(id: number, status: OrderStatus) {
    return this.databaseService.order.update({
      where: { id },
      data: { status },
    });
  }

  async ordersCount() {
    return await this.databaseService.order.count();
  }

  async totalRevuene() {
    const result = await this.databaseService.order.aggregate({
      _sum: { totalPrice: true },
      where: { status: 'SHIPPED' },
    });

    return result._sum.totalPrice ?? 0;
  }

  async pendingOrders() {
    return this.databaseService.order.findMany({
      orderBy: { createdAt: 'desc' },
      where: { status: 'PENDING' },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}
