import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../users.repository';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class UpdateProfileService {
  constructor(private readonly usersRepository: UsersRepository) { }

  async execute(id: number, updateProfileDto: UpdateProfileDto) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.update(id, updateProfileDto);
    const userResult = await this.usersRepository.findById(id);
    return { ...userResult, password: undefined };
  }
}
