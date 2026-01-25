import { Module } from '@nestjs/common';
import { RefreshTokenController } from './refresh-token.controller';
import { RefreshTokenService } from './refresh-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../users/user.model';
import { UsersRepository } from '../../../infra/entity/users/users.repository';
import { GenerateTokensModule } from '../generate-tokens/generate-tokens.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    GenerateTokensModule,
  ],
  controllers: [RefreshTokenController],
  providers: [RefreshTokenService, UsersRepository],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule { }
