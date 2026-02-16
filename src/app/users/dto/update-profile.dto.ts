import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { Gender } from '../enums/gender.enum';
import { UnitSystem } from '../enums/unit-system.enum';
import { ActivityLevel } from '../enums/activity-level.enum';
import { UserStatus } from '../enums/user-status.enum';

export class UpdateProfileDto {
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsNumber()
  @IsOptional()
  @Min(1)
  age?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  weight?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  height?: number;

  @IsEnum(UnitSystem)
  @IsOptional()
  unitSystem?: UnitSystem;

  @IsEnum(ActivityLevel)
  @IsOptional()
  activityLevel?: ActivityLevel;

  @IsNumber()
  @IsOptional()
  @Min(0)
  caloricGoal?: number;

  @IsEnum(UserStatus)
  @IsNotEmpty()
  status: UserStatus;
}
