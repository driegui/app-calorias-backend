import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './recipe.model';
import { RecipesRepository } from './recipes.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe])],
  providers: [RecipesRepository],
  exports: [RecipesRepository, TypeOrmModule],
})
export class RecipesModule { }
