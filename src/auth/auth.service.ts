import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
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

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    const refreshExpiresIn = this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN');
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: refreshExpiresIn as JwtSignOptions['expiresIn'],
    });

    const expiresIn = this.configService.getOrThrow<string>('JWT_EXPIRES_IN');
    const expiresAt = new Date();

    // Simple parsing for "60m" or similar. Defaults to 60m if parsing fails.
    if (expiresIn && expiresIn.endsWith('m')) {
      const minutes = parseInt(expiresIn.replace('m', ''), 10);
      expiresAt.setMinutes(expiresAt.getMinutes() + minutes);
    } else {
      expiresAt.setMinutes(expiresAt.getMinutes() + 60);
    }

    const refreshExpiresAt = new Date();
    if (refreshExpiresIn.endsWith('d')) {
      const days = parseInt(refreshExpiresIn.replace('d', ''), 10);
      refreshExpiresAt.setDate(refreshExpiresAt.getDate() + days);
    }

    return {
      accessToken,
      refreshToken,
      expiresAt: expiresAt,
      refreshExpiresAt,
    };
  }
}
