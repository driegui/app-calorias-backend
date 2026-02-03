import { Controller, Get, Post, Query, UseGuards, Param, ParseIntPipe, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../../../app/auth/jwt-auth.guard';
import { SearchIngredientsService } from './search-ingredients/search-ingredients.service';
import { SearchIngredientsDto } from './dto/search-ingredients.dto';
import { GetIngredientDetailsService } from './get-ingredient-details/get-ingredient-details.service';
import { CreateIngredientService } from './create-ingredient/create-ingredient.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UserId } from '../../../shared/decorators/user-id.decorator';

@Controller('ingredients')
export class IngredientsController {
  constructor(
    private readonly searchIngredientsService: SearchIngredientsService,
    private readonly getIngredientDetailsService: GetIngredientDetailsService,
    private readonly createIngredientService: CreateIngredientService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  search(@Query() searchDto: SearchIngredientsDto) {
    return this.searchIngredientsService.execute(searchDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getDetails(@Param('id', ParseIntPipe) id: number) {
    return this.getIngredientDetailsService.execute(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createIngredientDto: CreateIngredientDto, @UserId() userId: number) {
    return this.createIngredientService.execute(createIngredientDto, userId);
  }
}
