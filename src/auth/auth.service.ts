import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthRegisterDto } from './dto/auth-register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(authRegisterDto: AuthRegisterDto) {
    const existUser = await this.usersService.findOne(authRegisterDto.email);
    if (existUser) throw new BadRequestException('This user already exist');

    const user = await this.usersService.create(authRegisterDto);
    const tokens = await this.issueToken(user.id);

    return {
      user: { id: user.id, email: user.email },
      ...tokens,
    };
  }

  async login(id: number, email: string) {
    const tokens = await this.issueToken(id);
    return {
      user: { id, email },
      ...tokens,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const passwordIsMatch = await bcrypt.compare(password, user.password);

    if (user && passwordIsMatch) {
      return user;
    }
    throw new UnauthorizedException('User or password are incorrect');
  }

  async logout(userId: number) {
    await this.usersService.removeRefreshToken(userId);
    return { cookie: this.getCookiesForLogout() };
  }

  private getAccessToken(id: number) {
    const payload = { id };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION'),
    });
  }

  private getCookieRefreshToken(id: number) {
    const payload = { id };
    const refreshTokenCookie = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_EXPIRATION')}`,
    });
    const cookie = `Refresh=${refreshTokenCookie}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_EXPIRATION')}; SameSite=Lax;`;
    return { cookie, refreshTokenCookie };
  }

  private async issueToken(userId: number) {
    const accessToken = this.getAccessToken(userId);
    const refreshToken = this.getCookieRefreshToken(userId);

    await this.usersService.setCurrentRefreshToken(
      refreshToken.refreshTokenCookie,
      userId,
    );

    return { accessToken, refreshTokenCookie: refreshToken.cookie };
  }

  private getCookiesForLogout() {
    return ['Refresh=; HttpOnly; Path=/; Max-Age=0'];
  }

  public issueAccessToken(userId: number) {
    return this.getAccessToken(userId);
  }
}
