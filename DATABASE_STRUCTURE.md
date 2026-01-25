# Estrutura do Banco de Dados - App Calorias

## Visão Geral

Este documento descreve a estrutura completa do banco de dados da aplicação de controle de calorias, implementada com **TypeORM** e **PostgreSQL**.

## Diagrama de Relacionamentos

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       │ 1:N
       │
       ▼
┌──────────────────┐
│ ConsumptionLog   │◄─────┐
└──────┬───────────┘      │
       │                  │
       │ N:1          N:1 │
       │                  │
       ▼                  │
┌─────────────┐    ┌──────┴──────┐
│  Recipe     │    │ Ingredient  │
└──────┬──────┘    └──────┬──────┘
       │                  │
       │ 1:N          1:N │
       │                  │
       │   ┌──────────────┘
       │   │
       ▼   ▼
┌─────────────────────┐
│ RecipeIngredient    │
│  (Tabela Pivot)     │
└─────────────────────┘
       
       ┌─────────────────┐
       │ IngredientAlias │
       │    (Aliases)    │
       └────────┬────────┘
                │ N:1
                │
                ▼
         ┌─────────────┐
         │ Ingredient  │
         └─────────────┘
```

## Entidades

### 1. User (Usuário)

**Tabela:** `user`  
**Arquivo:** `src/app/users/user.model.ts`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | SERIAL (PK) | Identificador único |
| `name` | VARCHAR(255) | Nome do usuário |
| `email` | VARCHAR(255) UNIQUE | Email (usado para login) |
| `password` | VARCHAR | Senha hasheada (bcrypt) |
| `gender` | ENUM | Gênero (MALE/FEMALE) |
| `age` | INTEGER | Idade |
| `weight` | FLOAT | Peso |
| `height` | FLOAT | Altura |
| `unitSystem` | ENUM | Sistema de unidades |
| `activityLevel` | ENUM | Nível de atividade (SEDENTARY/ACTIVE/VERY_ACTIVE) |
| `caloricGoal` | INTEGER | Meta calórica diária |
| `status` | ENUM | Status da conta |

**Relacionamentos:**
- `consumptionLogs` (1:N) → ConsumptionLog

---

### 2. Ingredient (Ingrediente)

**Tabela:** `ingredient`  
**Arquivo:** `src/app/ingredients/ingredient.model.ts`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | SERIAL (PK) | Identificador único |
| `name` | VARCHAR(255) | Nome do ingrediente |
| `unitOfMeasure` | VARCHAR(50) | Unidade de medida (grams, ml, units) |
| `caloriesPerUnit` | FLOAT | Calorias por unidade |
| `createdAt` | TIMESTAMP | Data de criação |
| `updatedAt` | TIMESTAMP | Data de atualização |
| `createdBy` | VARCHAR(255) | Nome do criador |
| `creatorEmail` | VARCHAR(255) | Email do criador |

**Relacionamentos:**
- `aliases` (1:N) → IngredientAlias
- `recipeIngredients` (1:N) → RecipeIngredient
- `consumptionLogs` (1:N) → ConsumptionLog

---

### 3. IngredientAlias (Nome Alternativo)

**Tabela:** `ingredientAlias`  
**Arquivo:** `src/app/ingredient-aliases/ingredient-alias.model.ts`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | SERIAL (PK) | Identificador único |
| `ingredientId` | INTEGER (FK) | Referência ao ingrediente |
| `aliasName` | VARCHAR(255) | Nome alternativo |
| `createdAt` | TIMESTAMP | Data de criação |
| `updatedAt` | TIMESTAMP | Data de atualização |
| `createdBy` | VARCHAR(255) | Nome do criador |
| `creatorEmail` | VARCHAR(255) | Email do criador |

**Relacionamentos:**
- `ingredient` (N:1) → Ingredient (CASCADE on delete)

**Exemplo de Uso:**
- Ingrediente: "Tomate"
- Aliases: "Tomate Cereja", "Tomate Italiano", "Tomatinho"

---

### 4. Recipe (Receita)

**Tabela:** `recipe`  
**Arquivo:** `src/app/recipes/recipe.model.ts`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | SERIAL (PK) | Identificador único |
| `name` | VARCHAR(255) | Nome da receita |
| `instructions` | TEXT | Instruções de preparo |
| `prepTimeMinutes` | INTEGER | Tempo de preparo (minutos) |
| `cookTimeMinutes` | INTEGER | Tempo de cozimento (minutos) |
| `servings` | INTEGER | Número de porções |
| `portionSize` | FLOAT | Tamanho da porção |
| `caloriesPerPortion` | FLOAT | Calorias por porção |
| `difficulty` | ENUM | Dificuldade (EASY/MEDIUM/HARD) |
| `isPublic` | BOOLEAN | Receita pública ou privada |
| `createdAt` | TIMESTAMP | Data de criação |
| `updatedAt` | TIMESTAMP | Data de atualização |
| `createdBy` | VARCHAR(255) | Nome do criador |
| `creatorEmail` | VARCHAR(255) | Email do criador |

**Relacionamentos:**
- `recipeIngredients` (1:N) → RecipeIngredient (CASCADE)
- `consumptionLogs` (1:N) → ConsumptionLog

---

### 5. RecipeIngredient (Ingredientes da Receita)

**Tabela:** `recipeIngredient`  
**Arquivo:** `src/app/recipe-ingredients/recipe-ingredient.model.ts`

**Chave Composta:** `(recipeId, ingredientId)`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `recipeId` | INTEGER (PK, FK) | Referência à receita |
| `ingredientId` | INTEGER (PK, FK) | Referência ao ingrediente |
| `quantityIngredient` | FLOAT | Quantidade do ingrediente |

**Relacionamentos:**
- `recipe` (N:1) → Recipe (CASCADE on delete)
- `ingredient` (N:1) → Ingredient (RESTRICT on delete)

**Regra de Negócio:**
- RESTRICT garante que não se pode deletar um ingrediente que está em uso em receitas

---

### 6. ConsumptionLog (Registro de Consumo)

**Tabela:** `consumptionLog`  
**Arquivo:** `src/app/consumption-logs/consumption-log.model.ts`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | SERIAL (PK) | Identificador único |
| `userId` | INTEGER (FK) | Referência ao usuário |
| `recipeId` | INTEGER (FK, NULL) | Referência à receita (opcional) |
| `ingredientId` | INTEGER (FK, NULL) | Referência ao ingrediente (opcional) |
| `quantity` | FLOAT | Quantidade consumida |
| `totalCaloriesSpent` | FLOAT | Total de calorias gastas |
| `loggedAt` | TIMESTAMP | Data/hora do consumo |
| `createdAt` | TIMESTAMP | Data de criação do registro |
| `updatedAt` | TIMESTAMP | Data de atualização |
| `createdBy` | VARCHAR(255) | Nome do criador |
| `creatorEmail` | VARCHAR(255) | Email do criador |

**Relacionamentos:**
- `user` (N:1) → User (CASCADE on delete)
- `recipe` (N:1) → Recipe (SET NULL on delete)
- `ingredient` (N:1) → Ingredient (SET NULL on delete)

**Constraint CHECK:**
```sql
CHECK (
  (recipeId IS NOT NULL AND ingredientId IS NULL) OR 
  (recipeId IS NULL AND ingredientId IS NOT NULL)
)
```

**Regra de Negócio:**
- Um log DEVE referenciar OU uma receita OU um ingrediente, nunca ambos
- Permite rastrear tanto consumo de receitas completas quanto ingredientes avulsos

---

## Estrutura de Arquivos

Cada entidade segue o padrão de organização:

```
src/app/{entity-name}/
├── {entity-name}.model.ts      # Definição da entidade TypeORM
├── {entity-name}.repository.ts # Métodos de acesso a dados
└── {entity-name}.module.ts     # Módulo NestJS
```

### Exemplo: Ingredients

```
src/app/ingredients/
├── ingredient.model.ts         # Entity com @decorators
├── ingredients.repository.ts   # CRUD methods
└── ingredients.module.ts       # Exports repository
```

## Repositories Disponíveis

### UsersRepository
```typescript
- createAndSave(userData: Partial<User>): Promise<User>
- findByEmail(email: string): Promise<User | null>
- findById(id: number): Promise<User | null>
- update(id: number, userData: Partial<User>): Promise<void>
```

### IngredientsRepository
```typescript
- createAndSave(ingredientData: Partial<Ingredient>): Promise<Ingredient>
- findById(id: number): Promise<Ingredient | null>
- findByName(name: string): Promise<Ingredient | null>
- findAll(): Promise<Ingredient[]>
- update(id: number, ingredientData: Partial<Ingredient>): Promise<void>
- delete(id: number): Promise<void>
```

### IngredientAliasesRepository
```typescript
- createAndSave(aliasData: Partial<IngredientAlias>): Promise<IngredientAlias>
- findById(id: number): Promise<IngredientAlias | null>
- findByIngredientId(ingredientId: number): Promise<IngredientAlias[]>
- findByAliasName(aliasName: string): Promise<IngredientAlias | null>
- delete(id: number): Promise<void>
```

### RecipesRepository
```typescript
- createAndSave(recipeData: Partial<Recipe>): Promise<Recipe>
- findById(id: number): Promise<Recipe | null>  // Com ingredientes
- findByName(name: string): Promise<Recipe | null>
- findAll(): Promise<Recipe[]>
- findPublicRecipes(): Promise<Recipe[]>
- findByCreatorEmail(creatorEmail: string): Promise<Recipe[]>
- update(id: number, recipeData: Partial<Recipe>): Promise<void>
- delete(id: number): Promise<void>
```

### RecipeIngredientsRepository
```typescript
- createAndSave(recipeIngredientData: Partial<RecipeIngredient>): Promise<RecipeIngredient>
- findByRecipeId(recipeId: number): Promise<RecipeIngredient[]>
- findByIngredientId(ingredientId: number): Promise<RecipeIngredient[]>
- findByRecipeAndIngredient(recipeId: number, ingredientId: number): Promise<RecipeIngredient | null>
- update(recipeId: number, ingredientId: number, data: Partial<RecipeIngredient>): Promise<void>
- delete(recipeId: number, ingredientId: number): Promise<void>
- deleteByRecipeId(recipeId: number): Promise<void>
```

### ConsumptionLogsRepository
```typescript
- createAndSave(logData: Partial<ConsumptionLog>): Promise<ConsumptionLog>
- findById(id: number): Promise<ConsumptionLog | null>
- findByUserId(userId: number): Promise<ConsumptionLog[]>
- findByUserIdAndDateRange(userId: number, startDate: Date, endDate: Date): Promise<ConsumptionLog[]>
- findByRecipeId(recipeId: number): Promise<ConsumptionLog[]>
- findByIngredientId(ingredientId: number): Promise<ConsumptionLog[]>
- getTotalCaloriesByUserAndDate(userId: number, date: Date): Promise<number>
- update(id: number, logData: Partial<ConsumptionLog>): Promise<void>
- delete(id: number): Promise<void>
```

## Campos de Auditoria

As seguintes entidades possuem campos de auditoria automática:

- `createdAt`: Timestamp automático na criação (@CreateDateColumn)
- `updatedAt`: Timestamp automático em updates (@UpdateDateColumn)
- `createdBy`: Nome do usuário que criou
- `creatorEmail`: Email do usuário que criou

**Entidades com Auditoria:**
- Ingredient
- IngredientAlias
- Recipe
- ConsumptionLog

## Cascatas e Relacionamentos

### Cascade DELETE
1. **User → ConsumptionLog**: Deletar usuário remove seus logs
2. **Ingredient → IngredientAlias**: Deletar ingrediente remove seus aliases
3. **Recipe → RecipeIngredient**: Deletar receita remove associações

### SET NULL on DELETE
1. **Recipe → ConsumptionLog**: Deletar receita mantém log mas seta recipeId NULL
2. **Ingredient → ConsumptionLog**: Deletar ingrediente mantém log mas seta ingredientId NULL

### RESTRICT on DELETE
1. **Ingredient → RecipeIngredient**: NÃO permite deletar ingrediente em uso

## Migração e Sincronização

⚠️ **Atenção**: O projeto está configurado com `synchronize: true` no TypeORM.

```typescript
// src/app.module.ts
synchronize: true, // Only for dev!
```

**Para Produção:**
- Desabilitar `synchronize`
- Usar migrations com TypeORM CLI
- Versionar schema changes

## Próximos Passos

1. ✅ Estrutura de entidades criada
2. ✅ Repositories implementados
3. ✅ Módulos registrados
4. 🔲 Criar controllers para cada entidade
5. 🔲 Implementar DTOs de validação
6. 🔲 Criar services de negócio
7. 🔲 Adicionar autenticação nas rotas
8. 🔲 Implementar cálculo automático de calorias

---

**Status**: ✅ Build bem-sucedido  
**TypeORM**: Sincronizado  
**Total de Entidades**: 6 tabelas
