import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(userId: number, createOrderDto: CreateOrderDto) {
    return this.databaseService.order.create({
      data: {
        userId,
        items: {
          create: createOrderDto.items.map((item) => ({
            mealId: item.mealId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    // TODO: If you need to add it so that the admin can change the order items
    return this.databaseService.order.update({
      where: { id },
      data: {
        status: updateOrderDto.status,
      },
    });
  }

  async remove(id: number) {
    return await this.databaseService.order.delete({
      where: { id },
    });
  }
}
