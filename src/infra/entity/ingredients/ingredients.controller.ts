import { Controller, Get, Query, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../../app/auth/jwt-auth.guard';
import { SearchIngredientsService } from './search-ingredients/search-ingredients.service';
import { SearchIngredientsDto } from './dto/search-ingredients.dto';
import { GetIngredientDetailsService } from './get-ingredient-details/get-ingredient-details.service';

@Controller('ingredients')
export class IngredientsController {
  constructor(
    private readonly searchIngredientsService: SearchIngredientsService,
    private readonly getIngredientDetailsService: GetIngredientDetailsService,
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
}
