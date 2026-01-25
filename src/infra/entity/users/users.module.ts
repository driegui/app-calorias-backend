import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateAccountModule } from '../../../app/users/create-account/create-account.module';
import { UsersController } from '../../../app/users/users.controller';
import { User } from '../../../app/users/user.model';
import { UpdateProfileModule } from '../../../app/users/update-profile/update-profile.module';
import { CalculateCaloricExpenditureService } from '../../../app/users/calculate-caloric-expenditure/calculate-caloric-expenditure.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CreateAccountModule, UpdateProfileModule],
  controllers: [UsersController],
  providers: [CalculateCaloricExpenditureService],
})
export class UsersModule { }
