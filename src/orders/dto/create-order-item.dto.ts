import { IsIn, IsInt, IsNumber } from 'class-validator';

export class CreateOrderItemDto {
  // TODO: mb we need object
  @IsInt()
  mealId: number;

  @IsInt()
  quantity: number;

  @IsNumber()
  price: number;
}
