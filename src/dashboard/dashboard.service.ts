import { Injectable } from '@nestjs/common';
import { MealsService } from 'src/meals/meals.service';
import { OrdersService } from 'src/orders/orders.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly mealsService: MealsService,
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
  ) {}

  async getStats() {
    const [meals, pendingOrders, users, orders, revenue] = await Promise.all([
      this.mealsService.mealsCount(),
      this.ordersService.pendingOrders(),
      this.usersService.usersCount(),
      this.ordersService.ordersCount(),
      this.ordersService.totalRevenue(),
    ]);

    return { meals, pendingOrders, users, orders, revenue };
  }
}
