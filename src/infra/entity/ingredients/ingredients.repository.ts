import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from './ingredient.model';

@Injectable()
export class IngredientsRepository {
  constructor(
    @InjectRepository(Ingredient)
    private readonly typeOrmRepository: Repository<Ingredient>,
  ) { }

  async createAndSave(ingredientData: Partial<Ingredient>): Promise<Ingredient> {
    const ingredient = this.typeOrmRepository.create(ingredientData);
    return this.typeOrmRepository.save(ingredient);
  }

  async findById(id: number): Promise<Ingredient | null> {
    return this.typeOrmRepository.findOne({
      where: { id },
      relations: ['aliases'],
    });
  }

  async findByIds(ids: number[]): Promise<Ingredient[]> {
    return this.typeOrmRepository.find({
      where: ids.map((id) => ({ id })),
    });
  }

  async findByName(name: string): Promise<Ingredient | null> {
    return this.typeOrmRepository.findOne({ where: { name } });
  }

  async search(nameFilter: string): Promise<Ingredient[]> {
    return this.typeOrmRepository
      .createQueryBuilder('ingredient')
      .where('LOWER(ingredient.name) LIKE LOWER(:nameFilter)', {
        nameFilter: `%${nameFilter}%`,
      })
      .orderBy('ingredient.name', 'ASC')
      .getMany();
  }

  async findAll(): Promise<Ingredient[]> {
    return this.typeOrmRepository.find();
  }

  async update(id: number, ingredientData: Partial<Ingredient>): Promise<void> {
    await this.typeOrmRepository.update(id, ingredientData);
  }

  async delete(id: number): Promise<void> {
    await this.typeOrmRepository.delete(id);
  }
}
