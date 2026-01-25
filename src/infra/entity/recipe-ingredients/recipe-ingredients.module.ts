import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeIngredient } from './recipe-ingredient.model';
import { RecipeIngredientsRepository } from './recipe-ingredients.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeIngredient])],
  providers: [RecipeIngredientsRepository],
  exports: [RecipeIngredientsRepository, TypeOrmModule],
})
export class RecipeIngredientsModule { }
