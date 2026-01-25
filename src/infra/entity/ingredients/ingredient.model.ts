import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IngredientAlias } from '../ingredient-aliases/ingredient-alias.model';
import { RecipeIngredient } from '../recipe-ingredients/recipe-ingredient.model';
import { ConsumptionLog } from '../consumption-logs/consumption-log.model';

@Entity('ingredient')
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  unitOfMeasure: string; // Ex: grams, ml, units

  @Column({ type: 'float', default: 0 })
  caloriesPerUnit: number;

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
  @OneToMany(() => IngredientAlias, (alias) => alias.ingredient, { cascade: true })
  aliases: IngredientAlias[];

  @OneToMany(() => RecipeIngredient, (recipeIngredient) => recipeIngredient.ingredient)
  recipeIngredients: RecipeIngredient[];

  @OneToMany(() => ConsumptionLog, (consumptionLog) => consumptionLog.ingredient)
  consumptionLogs: ConsumptionLog[];
}
