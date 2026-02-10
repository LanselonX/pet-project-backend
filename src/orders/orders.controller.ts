import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { ReqWithUser } from 'common/interfaces/request-user';

@Controller({ path: 'orders' })
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req: ReqWithUser) {
    const userId = req.user.id;
    return this.ordersService.confirmOrder(userId);
  }
}
