import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IngredientAlias } from './ingredient-alias.model';

@Injectable()
export class IngredientAliasesRepository {
  constructor(
    @InjectRepository(IngredientAlias)
    private readonly typeOrmRepository: Repository<IngredientAlias>,
  ) { }

  async createAndSave(aliasData: Partial<IngredientAlias>): Promise<IngredientAlias> {
    const alias = this.typeOrmRepository.create(aliasData);
    return this.typeOrmRepository.save(alias);
  }

  async findById(id: number): Promise<IngredientAlias | null> {
    return this.typeOrmRepository.findOne({ where: { id } });
  }

  async findByIngredientId(ingredientId: number): Promise<IngredientAlias[]> {
    return this.typeOrmRepository.find({ where: { ingredientId } });
  }

  async findByAliasName(aliasName: string): Promise<IngredientAlias | null> {
    return this.typeOrmRepository.findOne({ where: { aliasName } });
  }

  async delete(id: number): Promise<void> {
    await this.typeOrmRepository.delete(id);
  }
}
