import { Controller, Post, UseGuards, Body, Get, Query, ParseIntPipe, Param, Delete, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../../../app/auth/jwt-auth.guard';
import { CreateConsumptionLogService } from './create-consumption-log/create-consumption-log.service';
import { CreateConsumptionLogDto } from './dto/create-consumption-log.dto';
import { UserId } from '../../../shared/decorators/user-id.decorator';
import { ConsumptionLogsRepository } from './consumption-logs.repository';
import { GetDailyConsumptionService } from './get-daily-consumption/get-daily-consumption.service';
import { GetMonthlyConsumptionService } from './get-monthly-consumption/get-monthly-consumption.service';
import { DeleteConsumptionLogService } from './delete-consumption-log/delete-consumption-log.service';

@Controller('consumption-logs')
export class ConsumptionLogsController {
  constructor(
    private readonly createConsumptionLogService: CreateConsumptionLogService,
    private readonly consumptionLogsRepository: ConsumptionLogsRepository,
    private readonly getDailyConsumptionService: GetDailyConsumptionService,
    private readonly getMonthlyConsumptionService: GetMonthlyConsumptionService,
    private readonly deleteConsumptionLogService: DeleteConsumptionLogService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createConsumptionLogDto: CreateConsumptionLogDto,
    @UserId() userId: number,
  ) {
    return this.createConsumptionLogService.execute(createConsumptionLogDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('daily')
  async getDailyConsumption(
    @UserId() userId: number,
    @Query('date') dateStr?: string,
  ) {
    const date = dateStr ? new Date(dateStr) : new Date();
    return this.getDailyConsumptionService.execute(userId, date);
  }

  @UseGuards(JwtAuthGuard)
  @Get('monthly')
  async getMonthlyConsumption(
    @UserId() userId: number,
    @Query('year') yearStr?: string,
    @Query('month') monthStr?: string,
  ) {
    const now = new Date();
    const year = yearStr ? parseInt(yearStr, 10) : now.getFullYear();
    const month = monthStr ? parseInt(monthStr, 10) : now.getMonth() + 1;

    return this.getMonthlyConsumptionService.execute(userId, year, month);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getLogById(@Param('id', ParseIntPipe) id: number) {
    return this.consumptionLogsRepository.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @UserId() userId: number) {
    await this.deleteConsumptionLogService.execute(id, userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Consumption log deleted successfully',
    };
  }
}
