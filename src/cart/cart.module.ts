import { Module } from '@nestjs/common';
import { MealsModule } from 'src/meals/meals.module';
import { CartsService } from './cart.service';
import { CartsController } from './cart.controller';

@Module({
  controllers: [CartsController],
  imports: [MealsModule],
  providers: [CartsService],
  exports: [CartsService],
})
export class CartsModule {}
