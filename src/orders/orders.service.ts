import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateOrderDto } from './dto/create-order.dto';

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
}
