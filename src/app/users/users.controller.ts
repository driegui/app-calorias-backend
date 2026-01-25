import { Controller, Post, Body, Patch, UseGuards, Request, Get, Query } from '@nestjs/common';
import { CreateAccountService } from './create-account/create-account.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileService } from './update-profile/update-profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CalculateCaloricExpenditureService } from './calculate-caloric-expenditure/calculate-caloric-expenditure.service';
import { CalculateCaloricExpenditureDto } from './dto/calculate-caloric-expenditure.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createAccountService: CreateAccountService,
    private readonly updateProfileService: UpdateProfileService,
    private readonly calculateCaloricExpenditureService: CalculateCaloricExpenditureService,
  ) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.createAccountService.execute(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.updateProfileService.execute(req.user.userId, updateProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('caloric-expenditure')
  calculateCaloricExpenditure(@Query() query: CalculateCaloricExpenditureDto) {
    return this.calculateCaloricExpenditureService.execute(query);
  }
}
