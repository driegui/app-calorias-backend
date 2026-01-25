import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsumptionLog } from './consumption-log.model';
import { ConsumptionLogsRepository } from './consumption-logs.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ConsumptionLog])],
  providers: [ConsumptionLogsRepository],
  exports: [ConsumptionLogsRepository, TypeOrmModule],
})
export class ConsumptionLogsModule { }
