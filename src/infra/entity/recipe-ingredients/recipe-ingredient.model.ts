import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Recipe } from '../recipes/recipe.model';
import { Ingredient } from '../ingredients/ingredient.model';

@Entity('recipeIngredient')
export class RecipeIngredient {
  @PrimaryColumn({ type: 'int' })
  recipeId: number;

  @PrimaryColumn({ type: 'int' })
  ingredientId: number;

  @Column({ type: 'float' })
  quantityIngredient: number;

  // Relacionamentos
  @ManyToOne(() => Recipe, (recipe) => recipe.recipeIngredients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.recipeIngredients, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'ingredientId' })
  ingredient: Ingredient;
}
