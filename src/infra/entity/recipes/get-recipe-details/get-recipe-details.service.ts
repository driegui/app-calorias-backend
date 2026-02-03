import { Injectable, NotFoundException } from '@nestjs/common';
import { RecipesRepository } from '../recipes.repository';
import { Recipe } from '../recipe.model';

@Injectable()
export class GetRecipeDetailsService {
  constructor(private readonly recipesRepository: RecipesRepository) {}

  async execute(id: number): Promise<Recipe> {
    const recipe = await this.recipesRepository.findById(id);

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    return recipe;
  }
}
