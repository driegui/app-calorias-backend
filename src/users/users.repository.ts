import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(User)
        private readonly typeOrmRepository: Repository<User>,
    ) { }

    async createAndSave(userData: Partial<User>): Promise<User> {
        const user = this.typeOrmRepository.create(userData);
        return this.typeOrmRepository.save(user);
    }

    // Add finding methods as needed
    async findByEmail(email: string): Promise<User | null> {
        return this.typeOrmRepository.findOne({ where: { email } });
    }
}
