import { IsInt, IsNumber } from 'class-validator';

export class CreateOrderItemDto {
  @IsInt()
  mealId: number;

  @IsInt()
  quantity: number;

  @IsNumber()
  price: number;
}
