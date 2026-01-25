import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Ingredient } from '../ingredients/ingredient.model';

@Entity('ingredientAlias')
export class IngredientAlias {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  ingredientId: number;

  @Column({ type: 'varchar', length: 255 })
  aliasName: string;

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
  @ManyToOne(() => Ingredient, (ingredient) => ingredient.aliases, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ingredientId' })
  ingredient: Ingredient;
}
