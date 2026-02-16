import { Injectable, NotFoundException } from '@nestjs/common';
import { ConsumptionLogsRepository } from '../consumption-logs.repository';

@Injectable()
export class DeleteConsumptionLogService {
  constructor(
    private readonly consumptionLogsRepository: ConsumptionLogsRepository,
  ) {}

  async execute(id: number, userId: number): Promise<void> {
    const log = await this.consumptionLogsRepository.findById(id);

    if (!log) {
      throw new NotFoundException('Consumption log not found');
    }

    if (log.userId !== userId) {
      throw new NotFoundException('Consumption log not found');
    }

    await this.consumptionLogsRepository.delete(id);
  }
}
