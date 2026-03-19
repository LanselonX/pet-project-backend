import { Meal } from 'generated/prisma/client';

export class CartItemsResponseDto {
  id: number;
  meal: Meal;
  price: number;
  quantity: number;
  totalPrice?: number;
}
