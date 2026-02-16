import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsumptionLog } from './consumption-log.model';
import { ConsumptionLogsRepository } from './consumption-logs.repository';
import { ConsumptionLogsController } from './consumption-logs.controller';
import { CreateConsumptionLogService } from './create-consumption-log/create-consumption-log.service';
import { GetDailyConsumptionService } from './get-daily-consumption/get-daily-consumption.service';
import { GetMonthlyConsumptionService } from './get-monthly-consumption/get-monthly-consumption.service';
import { DeleteConsumptionLogService } from './delete-consumption-log/delete-consumption-log.service';
import { RecipesModule } from '../recipes/recipes.module';
import { IngredientsModule } from '../ingredients/ingredients.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConsumptionLog]),
    RecipesModule,
    IngredientsModule,
    UsersModule,
  ],
  controllers: [ConsumptionLogsController],
  providers: [
    ConsumptionLogsRepository,
    CreateConsumptionLogService,
    GetDailyConsumptionService,
    GetMonthlyConsumptionService,
    DeleteConsumptionLogService,
  ],
  exports: [ConsumptionLogsRepository, TypeOrmModule],
})
export class ConsumptionLogsModule { }
