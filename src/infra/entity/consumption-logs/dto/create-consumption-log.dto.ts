import { IsNumber, IsNotEmpty, IsOptional, Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateConsumptionLogDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  recipeId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  ingredientId?: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0.01)
  quantity: number;

  @IsOptional()
  @Type(() => Date)
  loggedAt?: Date;
}
