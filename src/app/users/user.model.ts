import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Gender } from './enums/gender.enum';
import { UnitSystem } from './enums/unit-system.enum';
import { ActivityLevel } from './enums/activity-level.enum';
import { UserStatus } from './enums/user-status.enum';
import { ConsumptionLog } from '../../infra/entity/consumption-logs/consumption-log.model';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender: Gender;

  @Column({ nullable: true })
  age: number;

  @Column({ type: 'float', nullable: true })
  weight: number;

  @Column({ type: 'float', nullable: true })
  height: number;

  @Column({
    type: 'enum',
    enum: UnitSystem,
    nullable: true,
  })
  unitSystem: UnitSystem;

  @Column({
    type: 'enum',
    enum: ActivityLevel,
    nullable: true,
  })
  activityLevel: ActivityLevel;

  @Column({ nullable: true })
  caloricGoal: number;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACCOUNT_CREATED,
  })
  status: UserStatus;

  @OneToMany(() => ConsumptionLog, (consumptionLog) => consumptionLog.user)
  consumptionLogs: ConsumptionLog[];
}
