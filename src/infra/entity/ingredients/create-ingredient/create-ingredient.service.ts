import { Injectable, ConflictException } from '@nestjs/common';
import { IngredientsRepository } from '../ingredients.repository';
import { CreateIngredientDto } from '../dto/create-ingredient.dto';
import { Ingredient } from '../ingredient.model';
import { UsersRepository } from '../../users/users.repository';

@Injectable()
export class CreateIngredientService {
  constructor(
    private readonly ingredientsRepository: IngredientsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(
    createIngredientDto: CreateIngredientDto,
    userId: number,
  ): Promise<Ingredient> {
    await this.validateIngredientName(createIngredientDto.name);

    const creatorEmail = await this.getUserEmail(userId);
    const ingredient = this.buildIngredient(createIngredientDto, creatorEmail);

    return this.ingredientsRepository.createAndSave(ingredient);
  }

  private async validateIngredientName(name: string): Promise<void> {
    const existingIngredient = await this.ingredientsRepository.findByName(name);

    if (existingIngredient) {
      throw new ConflictException('Ingredient with this name already exists');
    }
  }

  private async getUserEmail(userId: number): Promise<string> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ConflictException('User not found');
    }

    return user.email;
  }

  private buildIngredient(
    createIngredientDto: CreateIngredientDto,
    creatorEmail: string,
  ): Partial<Ingredient> {
    return {
      name: this.sanitizeName(createIngredientDto.name),
      unitOfMeasure: createIngredientDto.unitOfMeasure,
      caloriesPerUnit: createIngredientDto.caloriesPerUnit,
      creatorEmail,
      createdBy: creatorEmail,
    };
  }

  private sanitizeName(name: string): string {
    return name.trim().toLowerCase();
  }
}
