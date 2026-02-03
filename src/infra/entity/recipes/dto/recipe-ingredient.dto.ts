import { IsNumber, Min, IsNotEmpty } from 'class-validator';

export class RecipeIngredientDto {
  @IsNumber()
  @IsNotEmpty()
  ingredientId: number;

  @IsNumber()
  @Min(0)
  quantity: number;
}
