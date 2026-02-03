import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './recipe.model';
import { RecipesRepository } from './recipes.repository';
import { CreateRecipeService } from './create-recipe/create-recipe.service';
import { UpdateRecipeService } from './update-recipe/update-recipe.service';
import { GetRecipeDetailsService } from './get-recipe-details/get-recipe-details.service';
import { RecipesController } from './recipes.controller';
import { UsersModule } from '../users/users.module';
import { IngredientsModule } from '../ingredients/ingredients.module';
import { RecipeIngredientsModule } from '../recipe-ingredients/recipe-ingredients.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipe]),
    UsersModule,
    IngredientsModule,
    RecipeIngredientsModule,
  ],
  controllers: [RecipesController],
  providers: [RecipesRepository, CreateRecipeService, UpdateRecipeService, GetRecipeDetailsService],
  exports: [RecipesRepository, TypeOrmModule],
})
export class RecipesModule { }
