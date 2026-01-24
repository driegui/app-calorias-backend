import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateAccountModule } from './create-account/create-account.module';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { UpdateProfileModule } from './update-profile/update-profile.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CreateAccountModule, UpdateProfileModule],
  controllers: [UsersController],
  providers: [],
})
export class UsersModule { }
