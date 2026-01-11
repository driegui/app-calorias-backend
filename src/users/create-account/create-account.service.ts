import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersRepository } from '../users.repository';

@Injectable()
export class CreateAccountService {
  constructor(private readonly usersRepository: UsersRepository) { }

  async execute(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    return this.usersRepository.createAndSave({
      name,
      email,
      password: hashedPassword,
    });
  }
}
