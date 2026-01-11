import { Module } from '@nestjs/common';
import { CreateAccountService } from './create-account.service';
import { UsersRepository } from '../users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [CreateAccountService, UsersRepository],
  exports: [CreateAccountService],
})
export class CreateAccountModule { }
