import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

@Controller('auth')
export class RefreshTokenController {
  constructor(private refreshTokenService: RefreshTokenService) { }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.refreshTokenService.execute(refreshTokenDto.refreshToken);
  }
}
