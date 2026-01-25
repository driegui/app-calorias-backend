import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeIngredient } from './recipe-ingredient.model';

@Injectable()
export class RecipeIngredientsRepository {
  constructor(
    @InjectRepository(RecipeIngredient)
    private readonly typeOrmRepository: Repository<RecipeIngredient>,
  ) { }

  async createAndSave(recipeIngredientData: Partial<RecipeIngredient>): Promise<RecipeIngredient> {
    const recipeIngredient = this.typeOrmRepository.create(recipeIngredientData);
    return this.typeOrmRepository.save(recipeIngredient);
  }

  async findByRecipeId(recipeId: number): Promise<RecipeIngredient[]> {
    return this.typeOrmRepository.find({
      where: { recipeId },
      relations: ['ingredient'],
    });
  }

  async findByIngredientId(ingredientId: number): Promise<RecipeIngredient[]> {
    return this.typeOrmRepository.find({
      where: { ingredientId },
      relations: ['recipe'],
    });
  }

  async findByRecipeAndIngredient(
    recipeId: number,
    ingredientId: number,
  ): Promise<RecipeIngredient | null> {
    return this.typeOrmRepository.findOne({
      where: { recipeId, ingredientId },
    });
  }

  async update(
    recipeId: number,
    ingredientId: number,
    data: Partial<RecipeIngredient>,
  ): Promise<void> {
    await this.typeOrmRepository.update({ recipeId, ingredientId }, data);
  }

  async delete(recipeId: number, ingredientId: number): Promise<void> {
    await this.typeOrmRepository.delete({ recipeId, ingredientId });
  }

  async deleteByRecipeId(recipeId: number): Promise<void> {
    await this.typeOrmRepository.delete({ recipeId });
  }
}
