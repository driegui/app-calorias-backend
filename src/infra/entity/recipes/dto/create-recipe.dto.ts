import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsEnum,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RecipeDifficulty } from '../recipe.model';
import { RecipeIngredientDto } from './recipe-ingredient.dto';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  instructions?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  prepTimeMinutes?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  cookTimeMinutes?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  servings?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  portionSize?: number;

  @IsEnum(RecipeDifficulty)
  @IsOptional()
  difficulty?: RecipeDifficulty;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredientDto)
  ingredients: RecipeIngredientDto[];
}
