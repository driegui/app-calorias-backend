import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './infra/entity/users/users.module';
import { AuthModule } from './app/auth/auth.module';
import { RefreshTokenModule } from './app/auth/refresh-token/refresh-token.module';
import { IngredientsModule } from './infra/entity/ingredients/ingredients.module';
import { IngredientAliasesModule } from './infra/entity/ingredient-aliases/ingredient-aliases.module';
import { RecipesModule } from './infra/entity/recipes/recipes.module';
import { RecipeIngredientsModule } from './infra/entity/recipe-ingredients/recipe-ingredients.module';
import { ConsumptionLogsModule } from './infra/entity/consumption-logs/consumption-logs.module';

// Importar todas as entidades
import { User } from './app/users/user.model';
import { Ingredient } from './infra/entity/ingredients/ingredient.model';
import { IngredientAlias } from './infra/entity/ingredient-aliases/ingredient-alias.model';
import { Recipe } from './infra/entity/recipes/recipe.model';
import { RecipeIngredient } from './infra/entity/recipe-ingredients/recipe-ingredient.model';
import { ConsumptionLog } from './infra/entity/consumption-logs/consumption-log.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_DATABASE', 'postgres'),
        entities: [
          User,
          Ingredient,
          IngredientAlias,
          Recipe,
          RecipeIngredient,
          ConsumptionLog,
        ],
        synchronize: true, // Only for dev!
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    RefreshTokenModule,
    IngredientsModule,
    IngredientAliasesModule,
    RecipesModule,
    RecipeIngredientsModule,
    ConsumptionLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
