import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientAlias } from './ingredient-alias.model';
import { IngredientAliasesRepository } from './ingredient-aliases.repository';

@Module({
  imports: [TypeOrmModule.forFeature([IngredientAlias])],
  providers: [IngredientAliasesRepository],
  exports: [IngredientAliasesRepository, TypeOrmModule],
})
export class IngredientAliasesModule { }
