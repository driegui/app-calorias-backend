import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
} from 'typeorm';
import { User } from '../../../app/users/user.model';
import { Recipe } from '../recipes/recipe.model';
import { Ingredient } from '../ingredients/ingredient.model';

@Entity('consumptionLog')
@Check(`("recipeId" IS NOT NULL AND "ingredientId" IS NULL) OR ("recipeId" IS NULL AND "ingredientId" IS NOT NULL)`)
export class ConsumptionLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'int', nullable: true })
  recipeId: number | null;

  @Column({ type: 'int', nullable: true })
  ingredientId: number | null;

  @Column({ type: 'float' })
  quantity: number;

  @Column({ type: 'float', default: 0 })
  totalCaloriesSpent: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  loggedAt: Date;

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
  @ManyToOne(() => User, (user) => user.consumptionLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Recipe, (recipe) => recipe.consumptionLogs, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe | null;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.consumptionLogs, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'ingredientId' })
  ingredient: Ingredient | null;
}
