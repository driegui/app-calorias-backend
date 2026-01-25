import { Injectable } from '@nestjs/common';
import { IngredientsRepository } from '../ingredients.repository';
import { SearchIngredientsDto } from '../dto/search-ingredients.dto';
import { Ingredient } from '../ingredient.model';

@Injectable()
export class SearchIngredientsService {
  constructor(private readonly ingredientsRepository: IngredientsRepository) { }

  async execute(searchDto: SearchIngredientsDto): Promise<Ingredient[]> {
    return this.ingredientsRepository.search(searchDto.name);
  }
}
