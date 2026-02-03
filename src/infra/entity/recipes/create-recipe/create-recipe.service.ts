import { Injectable, ConflictException } from '@nestjs/common';
import { RecipesRepository } from '../recipes.repository';
import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { Recipe } from '../recipe.model';
import { RecipeIngredient } from '../../recipe-ingredients/recipe-ingredient.model';
import { UsersRepository } from '../../users/users.repository';
import { IngredientsRepository } from '../../ingredients/ingredients.repository';
import { Ingredient } from '../../ingredients/ingredient.model';

@Injectable()
export class CreateRecipeService {
  constructor(
    private readonly recipesRepository: RecipesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly ingredientsRepository: IngredientsRepository,
  ) {}

  async execute(
    createRecipeDto: CreateRecipeDto,
    userId: number,
  ): Promise<Recipe> {
    await this.validateRecipeName(createRecipeDto.name, userId);

    const creatorEmail = await this.getUserEmail(userId);
    const ingredientIds = this.extractIngredientIds(createRecipeDto);
    const ingredients = await this.validateIngredients(ingredientIds);

    const caloriesPerPortion = this.calculateCaloriesPerPortion(
      createRecipeDto,
      ingredients,
    );

    const recipe = this.buildRecipe(
      createRecipeDto,
      creatorEmail,
      caloriesPerPortion,
    );

    recipe.recipeIngredients = this.buildRecipeIngredients(
      createRecipeDto.ingredients,
      recipe,
    );

    return this.recipesRepository.createAndSave(recipe);
  }

  private async validateRecipeName(
    name: string,
    userId: number,
  ): Promise<void> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new ConflictException('User not found');
    }

    const existingRecipe =
      await this.recipesRepository.findByNameAndCreatorEmail(name, user.email);

    if (existingRecipe) {
      throw new ConflictException('Recipe with this name already exists');
    }
  }

  private async getUserEmail(userId: number): Promise<string> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ConflictException('User not found');
    }

    return user.email;
  }

  private extractIngredientIds(
    createRecipeDto: CreateRecipeDto,
  ): number[] {
    return createRecipeDto.ingredients.map(
      (ingredient) => ingredient.ingredientId,
    );
  }

  private async validateIngredients(
    ingredientIds: number[],
  ): Promise<Ingredient[]> {
    const ingredients =
      await this.ingredientsRepository.findByIds(ingredientIds);

    if (ingredients.length !== ingredientIds.length) {
      throw new ConflictException('One or more ingredients not found');
    }

    return ingredients;
  }

  private calculateCaloriesPerPortion(
    createRecipeDto: CreateRecipeDto,
    ingredients: Ingredient[],
  ): number {
    const totalCalories = createRecipeDto.ingredients.reduce(
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

    const servings = createRecipeDto.servings || 1;

    return totalCalories / servings;
  }

  private buildRecipe(
    createRecipeDto: CreateRecipeDto,
    creatorEmail: string,
    caloriesPerPortion: number,
  ): Partial<Recipe> {
    return {
      name: this.sanitizeName(createRecipeDto.name),
      instructions: createRecipeDto.instructions,
      prepTimeMinutes: createRecipeDto.prepTimeMinutes || 0,
      cookTimeMinutes: createRecipeDto.cookTimeMinutes || 0,
      servings: createRecipeDto.servings || 1,
      portionSize: createRecipeDto.portionSize || 0,
      difficulty: createRecipeDto.difficulty,
      isPublic: createRecipeDto.isPublic || false,
      caloriesPerPortion,
      creatorEmail,
      createdBy: creatorEmail,
    };
  }

  private buildRecipeIngredients(
    ingredientsDto: CreateRecipeDto['ingredients'],
    recipe: Partial<Recipe>,
  ): RecipeIngredient[] {
    return ingredientsDto.map((ingredientDto) => {
      const recipeIngredient = new RecipeIngredient();
      recipeIngredient.ingredientId = ingredientDto.ingredientId;
      recipeIngredient.quantityIngredient = ingredientDto.quantity;
      recipeIngredient.recipe = recipe as Recipe;
      return recipeIngredient;
    });
  }

  private sanitizeName(name: string): string {
    return name.trim();
  }
}
