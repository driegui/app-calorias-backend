import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SearchIngredientsDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2, { message: 'Name filter must be at least 2 characters long' })
  name: string;
}
