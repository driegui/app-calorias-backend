import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { RecipeIngredient } from '../recipe-ingredients/recipe-ingredient.model';
import { ConsumptionLog } from '../consumption-logs/consumption-log.model';

export enum RecipeDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

@Entity('recipe')
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @Column({ type: 'int', default: 0 })
  prepTimeMinutes: number;

  @Column({ type: 'int', default: 0 })
  cookTimeMinutes: number;

  @Column({ type: 'int', default: 1 })
  servings: number;

  @Column({ type: 'float', default: 0 })
  portionSize: number;

  @Column({ type: 'float', default: 0 })
  caloriesPerPortion: number;

  @Column({
    type: 'enum',
    enum: RecipeDifficulty,
    nullable: true,
  })
  difficulty: RecipeDifficulty;

  @Column({ type: 'boolean', default: false })
  isPublic: boolean;

  // Campos de Auditoria
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  createdBy: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  creatorEmail: string;

  // Relacionamentos
  @OneToMany(() => RecipeIngredient, (recipeIngredient) => recipeIngredient.recipe, { cascade: true })
  recipeIngredients: RecipeIngredient[];

  @OneToMany(() => ConsumptionLog, (consumptionLog) => consumptionLog.recipe)
  consumptionLogs: ConsumptionLog[];
}
