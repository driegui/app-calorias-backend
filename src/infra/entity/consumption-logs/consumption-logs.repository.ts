import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ConsumptionLog } from './consumption-log.model';

@Injectable()
export class ConsumptionLogsRepository {
  constructor(
    @InjectRepository(ConsumptionLog)
    private readonly typeOrmRepository: Repository<ConsumptionLog>,
  ) { }

  async createAndSave(logData: Partial<ConsumptionLog>): Promise<ConsumptionLog> {
    const log = this.typeOrmRepository.create(logData);
    return this.typeOrmRepository.save(log);
  }

  async findById(id: number): Promise<ConsumptionLog | null> {
    return this.typeOrmRepository.findOne({
      where: { id },
      relations: ['user', 'recipe', 'ingredient'],
    });
  }

  async findByUserId(userId: number): Promise<ConsumptionLog[]> {
    return this.typeOrmRepository.find({
      where: { userId },
      relations: ['recipe', 'ingredient'],
      order: { loggedAt: 'DESC' },
    });
  }

  async findByUserIdAndDateRange(
    userId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<ConsumptionLog[]> {
    return this.typeOrmRepository.find({
      where: {
        userId,
        loggedAt: Between(startDate, endDate),
      },
      relations: ['recipe', 'ingredient'],
      order: { loggedAt: 'DESC' },
    });
  }

  async findByRecipeId(recipeId: number): Promise<ConsumptionLog[]> {
    return this.typeOrmRepository.find({
      where: { recipeId },
      relations: ['user'],
    });
  }

  async findByIngredientId(ingredientId: number): Promise<ConsumptionLog[]> {
    return this.typeOrmRepository.find({
      where: { ingredientId },
      relations: ['user'],
    });
  }

  async getTotalCaloriesByUserAndDate(
    userId: number,
    date: Date,
  ): Promise<number> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await this.typeOrmRepository
      .createQueryBuilder('consumptionLog')
      .select('SUM(consumptionLog.totalCaloriesSpent)', 'total')
      .where('consumptionLog.userId = :userId', { userId })
      .andWhere('consumptionLog.loggedAt BETWEEN :startOfDay AND :endOfDay', {
        startOfDay,
        endOfDay,
      })
      .getRawOne();

    return parseFloat(result?.total || '0');
  }

  async update(id: number, logData: Partial<ConsumptionLog>): Promise<void> {
    await this.typeOrmRepository.update(id, logData);
  }

  async delete(id: number): Promise<void> {
    await this.typeOrmRepository.delete(id);
  }
}
