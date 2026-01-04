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
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { AuthRegisterDto } from './dto/auth-register.dto';
import type { Response } from 'express';
import type { ReqWithUser } from 'common/interfaces/request-user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() authRegisterDto: AuthRegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshTokenCookie } =
      await this.authService.register(authRegisterDto);

    res.setHeader('Set-Cookie', refreshTokenCookie);
    return { user, accessToken };
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @Request() req: ReqWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshTokenCookie } =
      await this.authService.login(req.user.id, req.user.email);

    res.setHeader('Set-Cookie', [refreshTokenCookie]);
    return { user, accessToken };
  }

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  refresh(@Req() req: ReqWithUser) {
    const accessToken = this.authService.issueAccessToken(req.user.id);
    return { accessToken };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req() req: ReqWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { cookie } = await this.authService.logout(req.user.id);
    res.setHeader('Set-Cookie', cookie);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: ReqWithUser) {
    return req.user;
  }
}
