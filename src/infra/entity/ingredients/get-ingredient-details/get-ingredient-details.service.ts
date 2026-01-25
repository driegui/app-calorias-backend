import { Injectable, NotFoundException } from '@nestjs/common';
import { IngredientsRepository } from '../ingredients.repository';
import { Ingredient } from '../ingredient.model';

@Injectable()
export class GetIngredientDetailsService {
  constructor(private readonly ingredientsRepository: IngredientsRepository) { }

  async execute(id: number): Promise<Ingredient> {
    const ingredient = await this.ingredientsRepository.findById(id);

    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID ${id} not found`);
    }

    return ingredient;
  }
}
