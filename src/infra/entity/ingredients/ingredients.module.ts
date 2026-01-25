import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from './ingredient.model';
import { IngredientsRepository } from './ingredients.repository';
import { IngredientsController } from './ingredients.controller';
import { SearchIngredientsService } from './search-ingredients/search-ingredients.service';
import { GetIngredientDetailsService } from './get-ingredient-details/get-ingredient-details.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient])],
  controllers: [IngredientsController],
  providers: [IngredientsRepository, SearchIngredientsService, GetIngredientDetailsService],
  exports: [IngredientsRepository, TypeOrmModule],
})
export class IngredientsModule { }
