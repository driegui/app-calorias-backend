import { Injectable } from '@nestjs/common';
import { ConsumptionLogsRepository } from '../consumption-logs.repository';

export interface DailyCalories {
  date: Date;
  calories: number;
}

export interface MonthlyConsumptionResponse {
  year: number;
  month: number;
  totalCalories: number;
  averageCaloriesPerDay: number;
  dailyConsumption: DailyCalories[];
}

@Injectable()
export class GetMonthlyConsumptionService {
  constructor(
    private readonly consumptionLogsRepository: ConsumptionLogsRepository,
  ) {}

  async execute(
    userId: number,
    year: number,
    month: number,
  ): Promise<MonthlyConsumptionResponse> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const logs = await this.consumptionLogsRepository.findByUserIdAndDateRange(
      userId,
      startDate,
      endDate,
    );

    const dailyConsumptionMap = new Map<string, number>();

    logs.forEach((log) => {
      const dateKey = new Date(log.loggedAt);
      dateKey.setHours(0, 0, 0, 0);
      const dateStr = dateKey.toISOString().split('T')[0];

      const currentCalories = dailyConsumptionMap.get(dateStr) || 0;
      dailyConsumptionMap.set(dateStr, currentCalories + log.totalCaloriesSpent);
    });

    const totalCalories = logs.reduce(
      (sum, log) => sum + log.totalCaloriesSpent,
      0,
    );

    const daysInMonth = endDate.getDate();
    const daysWithData = dailyConsumptionMap.size;
    const averageCaloriesPerDay =
      daysWithData > 0 ? totalCalories / daysWithData : 0;

    const dailyConsumption: DailyCalories[] = Array.from(
      dailyConsumptionMap.entries(),
    ).map(([dateStr, calories]) => ({
      date: new Date(dateStr),
      calories,
    }));

    dailyConsumption.sort((a, b) => a.date.getTime() - b.date.getTime());

    return {
      year,
      month,
      totalCalories,
      averageCaloriesPerDay: Math.round(averageCaloriesPerDay),
      dailyConsumption,
    };
  }
}
