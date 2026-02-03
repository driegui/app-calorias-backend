import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { RecipesRepository } from '../recipes.repository';
import { UpdateRecipeDto } from '../dto/update-recipe.dto';
import { Recipe } from '../recipe.model';
import { RecipeIngredient } from '../../recipe-ingredients/recipe-ingredient.model';
import { UsersRepository } from '../../users/users.repository';
import { IngredientsRepository } from '../../ingredients/ingredients.repository';
import { Ingredient } from '../../ingredients/ingredient.model';
import { RecipeIngredientsRepository } from '../../recipe-ingredients/recipe-ingredients.repository';

@Injectable()
export class UpdateRecipeService {
  constructor(
    private readonly recipesRepository: RecipesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly ingredientsRepository: IngredientsRepository,
    private readonly recipeIngredientsRepository: RecipeIngredientsRepository,
  ) {}

  async execute(
    id: number,
    updateRecipeDto: UpdateRecipeDto,
    userId: number,
  ): Promise<Recipe> {
    const recipe = await this.validateRecipeOwnership(id, userId);

    const updateData: Partial<Recipe> = this.buildBasicUpdateData(
      updateRecipeDto,
    );

    if (this.shouldUpdateIngredients(updateRecipeDto)) {
      const ingredients = await this.validateIngredients(
        updateRecipeDto.ingredients!,
      );

      const caloriesPerPortion = this.calculateCaloriesPerPortion(
        updateRecipeDto,
        recipe,
        ingredients,
      );

      updateData.caloriesPerPortion = caloriesPerPortion;
      updateData.recipeIngredients = await this.buildRecipeIngredients(
        updateRecipeDto.ingredients!,
        recipe,
      );

      await this.recipeIngredientsRepository.deleteByRecipeId(id);
    }

    Object.assign(recipe, updateData);

    return this.recipesRepository.createAndSave(recipe);
  }

  private async validateRecipeOwnership(
    id: number,
    userId: number,
  ): Promise<Recipe> {
    const recipe = await this.recipesRepository.findById(id);

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (recipe.creatorEmail !== user.email) {
      throw new ForbiddenException('You do not own this recipe');
    }

    return recipe;
  }

  private buildBasicUpdateData(
    updateRecipeDto: UpdateRecipeDto,
  ): Partial<Recipe> {
    const updateData: Partial<Recipe> = {};

    if (updateRecipeDto.name !== undefined) {
      updateData.name = updateRecipeDto.name;
    }

    if (updateRecipeDto.instructions !== undefined) {
      updateData.instructions = updateRecipeDto.instructions;
    }

    if (updateRecipeDto.prepTimeMinutes !== undefined) {
      updateData.prepTimeMinutes = updateRecipeDto.prepTimeMinutes;
    }

    if (updateRecipeDto.cookTimeMinutes !== undefined) {
      updateData.cookTimeMinutes = updateRecipeDto.cookTimeMinutes;
    }

    if (updateRecipeDto.servings !== undefined) {
      updateData.servings = updateRecipeDto.servings;
    }

    if (updateRecipeDto.portionSize !== undefined) {
      updateData.portionSize = updateRecipeDto.portionSize;
    }

    if (updateRecipeDto.difficulty !== undefined) {
      updateData.difficulty = updateRecipeDto.difficulty;
    }

    if (updateRecipeDto.isPublic !== undefined) {
      updateData.isPublic = updateRecipeDto.isPublic;
    }

    return updateData;
  }

  private shouldUpdateIngredients(updateRecipeDto: UpdateRecipeDto): boolean {
    return updateRecipeDto.ingredients !== undefined;
  }

  private async validateIngredients(
    ingredientsDto: UpdateRecipeDto['ingredients'],
  ): Promise<Ingredient[]> {
    if (!ingredientsDto || ingredientsDto.length === 0) {
      return [];
    }

    const ingredientIds = ingredientsDto.map((dto) => dto.ingredientId);
    const ingredients =
      await this.ingredientsRepository.findByIds(ingredientIds);

    if (ingredients.length !== ingredientIds.length) {
      throw new NotFoundException('One or more ingredients not found');
    }

    return ingredients;
  }

  private calculateCaloriesPerPortion(
    updateRecipeDto: UpdateRecipeDto,
    recipe: Recipe,
    ingredients: Ingredient[],
  ): number {
    if (!updateRecipeDto.ingredients || updateRecipeDto.ingredients.length === 0) {
      return 0;
    }

    const totalCalories = updateRecipeDto.ingredients.reduce(
      (sum, ingredientDto) => {
        const ingredient = ingredients.find(
          (i) => i.id === ingredientDto.ingredientId,
        );

        if (!ingredient) {
          return sum;
        }

        return sum + ingredient.caloriesPerUnit * ingredientDto.quantity;
      },
      0,
    );

    const servings = updateRecipeDto.servings || recipe.servings || 1;

    return totalCalories / servings;
  }

  private async buildRecipeIngredients(
    ingredientsDto: UpdateRecipeDto['ingredients'],
    recipe: Recipe,
  ): Promise<RecipeIngredient[]> {
    if (!ingredientsDto || ingredientsDto.length === 0) {
      return [];
    }

    return ingredientsDto.map((ingredientDto) => {
      const recipeIngredient = new RecipeIngredient();
      recipeIngredient.ingredientId = ingredientDto.ingredientId;
      recipeIngredient.quantityIngredient = ingredientDto.quantity;
      recipeIngredient.recipe = recipe;
      return recipeIngredient;
    });
  }
}
