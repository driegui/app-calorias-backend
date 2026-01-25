import { IsEnum, IsNotEmpty, IsNumber, IsPositive, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Gender } from '../enums/gender.enum';
import { ActivityLevel } from '../enums/activity-level.enum';

export class CalculateCaloricExpenditureDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(30)
  @Max(300)
  @Type(() => Number)
  weight: number; // peso em kg

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(50)
  @Max(300)
  @Type(() => Number)
  height: number; // altura em cm

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(150)
  @Type(() => Number)
  age: number; // idade em anos

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  @IsEnum(ActivityLevel)
  activityLevel: ActivityLevel;
}
