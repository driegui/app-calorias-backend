import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateAccountModule } from './create-account/create-account.module';
import { UsersController } from './users.controller';
import { User } from './user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User]), CreateAccountModule],
    controllers: [UsersController],
    providers: [],
})
export class UsersModule { }
