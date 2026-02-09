import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CartsService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCartDto } from './dto/create-cart.dto';
import type { ReqWithUser } from 'common/interfaces/request-user';

@Controller({ path: 'cart' })
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createCartDto: CreateCartDto,
    @Request() req: ReqWithUser,
  ) {
    const userId = req.user.id;
    return this.cartsService.addToCart(userId, createCartDto);
  }
}
