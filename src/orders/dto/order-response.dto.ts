import { OrderStatus } from 'generated/prisma/client';

export class OrderResponseDto {
  id: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
}
