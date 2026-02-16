import { Injectable } from '@nestjs/common';
import { ConsumptionLogsRepository } from '../consumption-logs.repository';

export interface DailyConsumptionItem {
  id: number;
  type: 'recipe' | 'ingredient';
  name: string;
  quantity: number;
  calories: number;
  unit?: string;
  loggedAt: Date;
}

export interface DailyConsumptionResponse {
  date: Date;
  totalCalories: number;
  totalItems: number;
  items: DailyConsumptionItem[];
}

@Injectable()
export class GetDailyConsumptionService {
  constructor(
    private readonly consumptionLogsRepository: ConsumptionLogsRepository,
  ) {}

  async execute(userId: number, date: Date): Promise<DailyConsumptionResponse> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const logs = await this.consumptionLogsRepository.findByUserIdAndDateRange(
      userId,
      startOfDay,
      endOfDay,
    );

    const totalCalories = await this.consumptionLogsRepository.getTotalCaloriesByUserAndDate(
      userId,
      date,
    );

    const items: DailyConsumptionItem[] = logs.map((log) => ({
      id: log.id,
      type: log.recipeId ? 'recipe' : 'ingredient',
      name: log.recipeId ? log.recipe!.name : log.ingredient!.name,
      quantity: log.quantity,
      calories: log.totalCaloriesSpent,
      unit: log.recipeId ? 'porção' : log.ingredient!.unitOfMeasure,
      loggedAt: log.loggedAt,
    }));

    return {
      date: startOfDay,
      totalCalories,
      totalItems: items.length,
      items,
    };
  }
}
