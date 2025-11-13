import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existUser = await this.usersService.findOne(createUserDto.email);
    if (existUser) throw new BadRequestException('This user already exist');

    const user = await this.usersService.create(createUserDto);

    const access_token = this.getJwtSign(user.id);

    return { user, access_token };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne(email);
    if (!user) {
      return null;
    }
    const passwordIsMatch = await bcrypt.compare(password, user.password);

    if (user && passwordIsMatch) {
      return user;
    }
    throw new UnauthorizedException('User or password are incorrect');
  }

  async login(user: UserResponseDto) {
    const { id, email } = user;
    return {
      id,
      email,
      access_token: this.getJwtSign(id),
    };
  }

  private getJwtSign(id: number) {
    return this.jwtService.sign({ id });
  }
}
