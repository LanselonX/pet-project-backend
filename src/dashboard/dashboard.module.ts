import { Module } from '@nestjs/common';
import { MealsModule } from 'src/meals/meals.module';
import { OrdersModule } from 'src/orders/orders.module';
import { UsersModule } from 'src/users/user.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [MealsModule, UsersModule, OrdersModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
