import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GenerateTokensService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async execute(userId: number, email: string): Promise<{ accessToken: string; refreshToken: string; expiresAt: Date; refreshExpiresAt: Date }> {
    const payload = { sub: userId, email: email };
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
