import { Module } from '@nestjs/common';
import { GenerateTokensService } from './generate-tokens.service';

@Module({
  providers: [GenerateTokensService],
  exports: [GenerateTokensService],
})
export class GenerateTokensModule { }
