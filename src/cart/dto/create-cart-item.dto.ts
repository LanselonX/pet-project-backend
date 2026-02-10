import { IsInt } from 'class-validator';

export class CreateCartItemDto {
  @IsInt()
  mealId: number;

  @IsInt()
  quantity: number;
}
