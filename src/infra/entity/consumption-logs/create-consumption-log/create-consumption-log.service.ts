import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConsumptionLogsRepository } from '../consumption-logs.repository';
import { CreateConsumptionLogDto } from '../dto/create-consumption-log.dto';
import { ConsumptionLog } from '../consumption-log.model';
import { RecipesRepository } from '../../recipes/recipes.repository';
import { IngredientsRepository } from '../../ingredients/ingredients.repository';
import { UsersRepository } from '../../users/users.repository';
import { Recipe } from '../../recipes/recipe.model';
import { Ingredient } from '../../ingredients/ingredient.model';

@Injectable()
export class CreateConsumptionLogService {
  constructor(
    private readonly consumptionLogsRepository: ConsumptionLogsRepository,
    private readonly recipesRepository: RecipesRepository,
    private readonly ingredientsRepository: IngredientsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(
    createConsumptionLogDto: CreateConsumptionLogDto,
    userId: number,
  ): Promise<ConsumptionLog> {
    this.validateDto(createConsumptionLogDto);

    const creatorEmail = await this.getUserEmail(userId);
    const { totalCaloriesSpent, recipe, ingredient } =
      await this.calculateCalories(createConsumptionLogDto);

    const consumptionLog = this.buildConsumptionLog(
      createConsumptionLogDto,
      userId,
      totalCaloriesSpent,
      creatorEmail,
      recipe,
      ingredient,
    );

    return this.consumptionLogsRepository.createAndSave(consumptionLog);
  }

  private validateDto(dto: CreateConsumptionLogDto): void {
    if (!dto.recipeId && !dto.ingredientId) {
      throw new BadRequestException(
        'Either recipeId or ingredientId must be provided',
      );
    }

    if (dto.recipeId && dto.ingredientId) {
      throw new BadRequestException(
        'Only one of recipeId or ingredientId can be provided, not both',
      );
    }
  }

  private async getUserEmail(userId: number): Promise<string> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.email;
  }

  private async calculateCalories(dto: CreateConsumptionLogDto): Promise<{
    totalCaloriesSpent: number;
    recipe: Recipe | null;
    ingredient: Ingredient | null;
  }> {
    if (dto.recipeId) {
      return this.calculateRecipeCalories(dto);
    }

    return this.calculateIngredientCalories(dto);
  }

  private async calculateRecipeCalories(dto: CreateConsumptionLogDto): Promise<{
    totalCaloriesSpent: number;
    recipe: Recipe | null;
    ingredient: Ingredient | null;
  }> {
    const recipe = await this.recipesRepository.findById(dto.recipeId!);

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    const totalCaloriesSpent = recipe.caloriesPerPortion * dto.quantity;

    return {
      totalCaloriesSpent,
      recipe,
      ingredient: null,
    };
  }

  private async calculateIngredientCalories(
    dto: CreateConsumptionLogDto,
  ): Promise<{
    totalCaloriesSpent: number;
    recipe: Recipe | null;
    ingredient: Ingredient | null;
  }> {
    const ingredient = await this.ingredientsRepository.findById(
      dto.ingredientId!,
    );

    if (!ingredient) {
      throw new NotFoundException('Ingredient not found');
    }

    const totalCaloriesSpent = ingredient.caloriesPerUnit * dto.quantity;

    return {
      totalCaloriesSpent,
      recipe: null,
      ingredient,
    };
  }

  private buildConsumptionLog(
    dto: CreateConsumptionLogDto,
    userId: number,
    totalCaloriesSpent: number,
    creatorEmail: string,
    recipe: Recipe | null,
    ingredient: Ingredient | null,
  ): Partial<ConsumptionLog> {
    return {
      userId,
      recipeId: dto.recipeId || null,
      ingredientId: dto.ingredientId || null,
      quantity: dto.quantity,
      totalCaloriesSpent,
      loggedAt: dto.loggedAt || new Date(),
      createdBy: creatorEmail,
      creatorEmail,
    };
  }
}
