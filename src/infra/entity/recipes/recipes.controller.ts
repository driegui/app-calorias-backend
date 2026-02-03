import { Controller, Post, Patch, Get, UseGuards, Body, Param, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../../app/auth/jwt-auth.guard';
import { CreateRecipeService } from './create-recipe/create-recipe.service';
import { UpdateRecipeService } from './update-recipe/update-recipe.service';
import { GetRecipeDetailsService } from './get-recipe-details/get-recipe-details.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { UserId } from '../../../shared/decorators/user-id.decorator';

@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly createRecipeService: CreateRecipeService,
    private readonly updateRecipeService: UpdateRecipeService,
    private readonly getRecipeDetailsService: GetRecipeDetailsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto, @UserId() userId: number) {
    return this.createRecipeService.execute(createRecipeDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRecipeDto: UpdateRecipeDto,
    @UserId() userId: number,
  ) {
    return this.updateRecipeService.execute(id, updateRecipeDto, userId);
  }

  @Get(':id')
  getDetails(@Param('id', ParseIntPipe) id: number) {
    return this.getRecipeDetailsService.execute(id);
  }
}
