import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { MealsModule } from './meals/meals.module';
import { OrdersModule } from './orders/orders.module';
import { ChefsModule } from './chefs/chefs.module';

@Module({
  imports: [
    ChefsModule,
    OrdersModule,
    MealsModule,
    AuthModule,
    DatabaseModule,
    UsersModule,
  ],
})
export class AppModule {}
