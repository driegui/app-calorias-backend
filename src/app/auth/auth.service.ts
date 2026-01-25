import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../../infra/entity/users/users.repository';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { ConfigService } from '@nestjs/config';
import { GenerateTokensService } from './generate-tokens/generate-tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
    private generateTokensService: GenerateTokensService,
  ) { }

  async execute(signInDto: SignInDto): Promise<{ accessToken: string; refreshToken: string; expiresAt: Date; refreshExpiresAt: Date }> {
    const { email, password } = signInDto;
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokensService.execute(user.id, user.email);
  }
}
