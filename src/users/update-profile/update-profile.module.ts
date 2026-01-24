import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { UsersRepository } from '../users.repository';
import { UpdateProfileService } from './update-profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UpdateProfileService, UsersRepository],
  exports: [UpdateProfileService],
})
export class UpdateProfileModule { }
