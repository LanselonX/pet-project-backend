import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
  HttpStatus,
  HttpCode,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import type { RequestWithRes } from './interface/request-user';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Req() request: RequestWithRes,
  ) {
    const { user, accessToken, refreshTokenCookie } =
      await this.authService.register(createUserDto);

    request.res.setHeader('Set-Cookie', [refreshTokenCookie]);
    return { user, accessToken };
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Request() req) {
    const { user, accessToken, refreshTokenCookie } =
      await this.authService.login(req.user);

    req.res.setHeader('Set-Cookie', [refreshTokenCookie]);
    return { user, accessToken };
  }

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  refresh(@Req() request: RequestWithRes) {
    const accessToken = this.authService.issueAccessToken(request.user?.id);
    return { accessToken };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() request: RequestWithRes) {
    const { cookie } = await this.authService.logout(request.user.id);
    request.res.setHeader('Set-Cookie', cookie);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
