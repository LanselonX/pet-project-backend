import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { ReqWithUser } from 'common/interfaces/request-user';
import { FindAllOrdersDto } from './dto/find-all-orders.dto';
import { InfinityPaginationResponseDto } from 'common/dto/infinity-pagination-response.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { Order } from 'generated/prisma/client';
import { infinityPagination } from 'common/infinity-pagination';
import { OrderMapper } from './mapper/order.mapper';

@Controller({ path: 'orders' })
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req: ReqWithUser) {
    const userId = req.user.id;
    return this.ordersService.confirmOrder(userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Request() req: ReqWithUser,
    @Query() query: FindAllOrdersDto,
  ): Promise<InfinityPaginationResponseDto<OrderResponseDto | Order>> {
    const userId = req.user.id;

    const page = query?.page ?? 1;
    let limit = query?.limit ?? 5;
    if (limit > 50) {
      limit = 50;
    }

    const { orders, totalCount } =
      await this.ordersService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
        userId,
      });

    return infinityPagination(
      orders.map((o) => OrderMapper.toDto(o)),
      { page, limit },
      totalCount,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    return this.ordersService.getOrderById(+id);
  }
}
