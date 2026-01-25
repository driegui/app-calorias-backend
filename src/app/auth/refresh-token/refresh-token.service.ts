import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from '../../../infra/entity/users/users.repository';
import { GenerateTokensService } from '../generate-tokens/generate-tokens.service';

@Injectable()
export class RefreshTokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersRepository: UsersRepository,
    private generateTokensService: GenerateTokensService,
  ) { }

  async execute(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; expiresAt: Date; refreshExpiresAt: Date }> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      });

      const user = await this.usersRepository.findByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokensService.execute(user.id, user.email);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
