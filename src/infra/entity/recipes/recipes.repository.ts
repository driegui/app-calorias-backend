import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './recipe.model';

@Injectable()
export class RecipesRepository {
  constructor(
    @InjectRepository(Recipe)
    private readonly typeOrmRepository: Repository<Recipe>,
  ) { }

  async createAndSave(recipeData: Partial<Recipe>): Promise<Recipe> {
    const recipe = this.typeOrmRepository.create(recipeData);
    return this.typeOrmRepository.save(recipe);
  }

  async findById(id: number): Promise<Recipe | null> {
    return this.typeOrmRepository.findOne({
      where: { id },
      relations: ['recipeIngredients', 'recipeIngredients.ingredient'],
    });
  }

  async findByName(name: string): Promise<Recipe | null> {
    return this.typeOrmRepository.findOne({ where: { name } });
  }

  async findAll(): Promise<Recipe[]> {
    return this.typeOrmRepository.find();
  }

  async findPublicRecipes(): Promise<Recipe[]> {
    return this.typeOrmRepository.find({ where: { isPublic: true } });
  }

  async findByCreatorEmail(creatorEmail: string): Promise<Recipe[]> {
    return this.typeOrmRepository.find({ where: { creatorEmail } });
  }

  async update(id: number, recipeData: Partial<Recipe>): Promise<void> {
    await this.typeOrmRepository.update(id, recipeData);
  }

  async delete(id: number): Promise<void> {
    await this.typeOrmRepository.delete(id);
  }
}
