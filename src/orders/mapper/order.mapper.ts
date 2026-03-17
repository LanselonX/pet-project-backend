import { Order } from 'generated/prisma/client';
import { OrderResponseDto } from '../dto/order-response.dto';

export class OrderMapper {
  static toDto(raw: Order): OrderResponseDto {
    const dtoEntity = new OrderResponseDto();

    dtoEntity.id = raw.id;

    dtoEntity.status = raw.status;

    dtoEntity.totalPrice = raw.totalPrice;

    dtoEntity.createdAt = raw.createdAt;

    return dtoEntity;
  }
}
