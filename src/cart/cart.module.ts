import { Module } from '@nestjs/common';
import { CartsService } from './cart.service';
import { CartsController } from './cart.controller';
import { MealsModule } from 'src/meals/meals.module';

@Module({
  imports: [MealsModule],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService],
})
export class CartsModule {}
