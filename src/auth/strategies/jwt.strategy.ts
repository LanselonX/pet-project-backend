import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    //TODO: we need to find the best practice
    const secret = configService.get('JWT_SECRET');
    if (!secret) {
      throw new Error('secret key not found');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: { id: number }) {
    const user = await this.usersService.validateById(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }

    return { id: user.id, role: user.role };
  }
}
