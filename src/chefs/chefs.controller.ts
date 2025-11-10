import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ChefsService } from './chefs.service';
import { CreateChefDto } from './dto/create-chef.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'generated/prisma/enums';

@Controller({ path: 'chefs' })
export class ChefsController {
  constructor(private readonly chefsService: ChefsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createChefDto: CreateChefDto) {
    return this.chefsService.create(createChefDto.userId, createChefDto);
  }
}
