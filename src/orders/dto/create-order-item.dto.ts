import { IsInt } from 'class-validator';

export class CreateOrderItemDto {
  @IsInt()
  mealId: number;

  @IsInt()
  quantity: number;
}
