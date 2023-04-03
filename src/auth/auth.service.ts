import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignInDto } from '../auth/dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{ token: string }> {
    const user = await this.usersService.findOne(signInDto.username);

    if (!user || !(await bcrypt.compare(signInDto.password, user.password))) {
      throw new UnauthorizedException('用户名或者密码不正确');
    }

    const payload = { username: user.username, sub: user.id };

    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
