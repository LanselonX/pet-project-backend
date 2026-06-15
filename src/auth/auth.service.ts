import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { AuthRegisterDto } from './dto/auth-register.dto';

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

  getCookieAccessToken(id: number, role: string) {
    const payload = { id, role };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: Number(this.configService.get('JWT_ACCESS_EXPIRATION')),
    });

    const maxAge = Number(this.configService.get('JWT_ACCESS_EXPIRATION'));

    return `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=None; Secure;`;
  }

  getCookieRefreshToken(id: number) {
    const payload = { id };
    const refreshTokenCookie = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: Number(this.configService.get('JWT_REFRESH_EXPIRATION')),
    });

    const maxAge = Number(this.configService.get('JWT_REFRESH_EXPIRATION'));

    const cookie = `Refresh=${refreshTokenCookie}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=None; Secure;`;
    return { cookie, refreshTokenCookie };
  }

  private async issueToken(userId: number) {
    // TODO: check this!
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('user not found');
    }

    const accessTokenCookie = this.getCookieAccessToken(userId, user.role);
    const refreshToken = this.getCookieRefreshToken(userId);

    await this.usersService.setCurrentRefreshToken(
      refreshToken.refreshTokenCookie,
      userId,
    );

    return { accessTokenCookie, refreshTokenCookie: refreshToken.cookie };
  }

  private getCookiesForLogout() {
    return [
      `Authentication=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`,
      `Refresh=; HttpOnly; Path=/auth/refresh; Max-Age=0; SameSite=Lax`,
    ];
  }
}
