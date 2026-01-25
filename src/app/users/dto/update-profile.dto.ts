import { Gender } from '../enums/gender.enum';
import { UnitSystem } from '../enums/unit-system.enum';
import { ActivityLevel } from '../enums/activity-level.enum';
import { UserStatus } from '../enums/user-status.enum';

export class UpdateProfileDto {
  gender?: Gender;
  age?: number;
  weight?: number;
  height?: number;
  unitSystem?: UnitSystem;
  activityLevel?: ActivityLevel;
  caloricGoal?: number;
  status: UserStatus;
}
