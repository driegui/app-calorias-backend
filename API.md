# API Documentation - Calorias App

Esta documentação descreve todas as rotas disponíveis na API do aplicativo de controle calórico.

**Base URL**: `http://localhost:3000`

**Autenticação**: A API usa JWT (JSON Web Tokens) para autenticação. Inclua o token no header `Authorization`:

```
Authorization: Bearer <seu-jwt-token>
```

---

## Sumário

- [Health Check](#health-check)
- [Autenticação](#autenticação)
  - [Login](#login)
  - [Refresh Token](#refresh-token)
- [Usuários](#usuários)
  - [Criar Conta](#criar-conta)
  - [Atualizar Perfil](#atualizar-perfil)
  - [Calcular Gasto Calórico](#calcular-gasto-calórico)
- [Ingredientes](#ingredientes)
  - [Buscar Ingredientes](#buscar-ingredientes)
  - [Detalhes do Ingrediente](#detalhes-do-ingrediente)
  - [Criar Ingrediente](#criar-ingrediente)
- [Receitas](#receitas)
  - [Criar Receita](#criar-receita)
  - [Atualizar Receita](#atualizar-receita)
  - [Buscar Receita](#buscar-receita)

---

## Health Check

### GET `/`

Verifica se a API está funcionando.

**Autenticação**: Não requer

**Response** (200 OK):
```json
"Hello World!"
```

---

## Autenticação

### POST `/auth/login`

Faz login na aplicação e retorna um token JWT.

**Autenticação**: Não requer

**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response** (200 OK):
```json
{
  "accessToken": "string",
  "refreshToken": "string"
}
```

**Errors**:
- `401 Unauthorized`: Credenciais inválidas

---

### POST `/auth/refresh`

Renova o token de acesso usando o refresh token.

**Autenticação**: Não requer

**Request Body**:
```json
{
  "refreshToken": "string"
}
```

**Response** (200 OK):
```json
{
  "accessToken": "string",
  "refreshToken": "string"
}
```

**Errors**:
- `401 Unauthorized`: Refresh token inválido ou expirado

---

## Usuários

### POST `/users`

Cria uma nova conta de usuário.

**Autenticação**: Não requer

**Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response** (201 Created):
```json
{
  "id": "number",
  "name": "string",
  "email": "string",
  "gender": "MALE | FEMALE | OTHER",
  "age": "number",
  "weight": "number",
  "height": "number",
  "unitSystem": "METRIC | IMPERIAL",
  "activityLevel": "SEDENTARY | LIGHTLY_ACTIVE | MODERATELY_ACTIVE | VERY_ACTIVE | EXTRA_ACTIVE",
  "caloricGoal": "number",
  "status": "ACTIVE | INACTIVE",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

**Errors**:
- `409 Conflict`: Email já cadastrado

---

### PATCH `/users`

Atualiza o perfil do usuário autenticado.

**Autenticação**: Requer JWT

**Request Body** (todos os campos são opcionais):
```json
{
  "gender": "MALE | FEMALE | OTHER",
  "age": "number",
  "weight": "number",
  "height": "number",
  "unitSystem": "METRIC | IMPERIAL",
  "activityLevel": "SEDENTARY | LIGHTLY_ACTIVE | MODERATELY_ACTIVE | VERY_ACTIVE | EXTRA_ACTIVE",
  "caloricGoal": "number",
  "status": "ACTIVE | INACTIVE"
}
```

**Response** (200 OK):
```json
{
  "id": "number",
  "name": "string",
  "email": "string",
  "gender": "MALE | FEMALE | OTHER",
  "age": "number",
  "weight": "number",
  "height": "number",
  "unitSystem": "METRIC | IMPERIAL",
  "activityLevel": "SEDENTARY | LIGHTLY_ACTIVE | MODERATELY_ACTIVE | VERY_ACTIVE | EXTRA_ACTIVE",
  "caloricGoal": "number",
  "status": "ACTIVE | INACTIVE",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

**Errors**:
- `401 Unauthorized`: Token inválido ou ausente
- `404 Not Found`: Usuário não encontrado

---

### GET `/users/caloric-expenditure`

Calcula o gasto calórico diário baseado nos parâmetros fornecidos.

**Autenticação**: Requer JWT

**Query Parameters**:
```json
{
  "gender": "MALE | FEMALE | OTHER",
  "age": "number",
  "weight": "number",
  "height": "number",
  "unitSystem": "METRIC | IMPERIAL",
  "activityLevel": "SEDENTARY | LIGHTLY_ACTIVE | MODERATELY_ACTIVE | VERY_ACTIVE | EXTRA_ACTIVE"
}
```

**Response** (200 OK):
```json
{
  "basalMetabolicRate": "number",
  "totalDailyEnergyExpenditure": "number"
}
```

**Errors**:
- `401 Unauthorized`: Token inválido ou ausente

---

## Ingredientes

### GET `/ingredients/search`

Busca ingredientes por nome.

**Autenticação**: Requer JWT

**Query Parameters**:
```json
{
  "name": "string"
}
```

**Response** (200 OK):
```json
[
  {
    "id": "number",
    "name": "string",
    "unitOfMeasure": "string",
    "caloriesPerUnit": "number",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)",
    "createdBy": "string",
    "creatorEmail": "string"
  }
]
```

**Errors**:
- `401 Unauthorized`: Token inválido ou ausente

---

### GET `/ingredients/:id`

Retorna os detalhes de um ingrediente específico.

**Autenticação**: Requer JWT

**URL Parameter**: `id` (number) - ID do ingrediente

**Response** (200 OK):
```json
{
  "id": "number",
  "name": "string",
  "unitOfMeasure": "string",
  "caloriesPerUnit": "number",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)",
  "createdBy": "string",
  "creatorEmail": "string",
  "aliases": [
    {
      "id": "number",
      "name": "string",
      "ingredientId": "number"
    }
  ]
}
```

**Errors**:
- `401 Unauthorized`: Token inválido ou ausente
- `404 Not Found`: Ingrediente não encontrado

---

### POST `/ingredients`

Cria um novo ingrediente.

**Autenticação**: Requer JWT

**Request Body**:
```json
{
  "name": "string",
  "unitOfMeasure": "string",
  "caloriesPerUnit": "number"
}
```

**Response** (201 Created):
```json
{
  "id": "number",
  "name": "string",
  "unitOfMeasure": "string",
  "caloriesPerUnit": "number",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)",
  "createdBy": "string",
  "creatorEmail": "string"
}
```

**Errors**:
- `401 Unauthorized`: Token inválido ou ausente
- `409 Conflict`: Nome de ingrediente já existe

---

## Receitas

### POST `/recipes`

Cria uma nova receita com ingredientes.

**Autenticação**: Requer JWT

**Request Body**:
```json
{
  "name": "string",
  "instructions": "string (opcional)",
  "prepTimeMinutes": "number (opcional, default: 0)",
  "cookTimeMinutes": "number (opcional, default: 0)",
  "servings": "number (opcional, default: 1)",
  "portionSize": "number (opcional, default: 0)",
  "difficulty": "EASY | MEDIUM | HARD (opcional)",
  "isPublic": "boolean (opcional, default: false)",
  "ingredients": [
    {
      "ingredientId": "number",
      "quantity": "number"
    }
  ]
}
```

**Response** (201 Created):
```json
{
  "id": "number",
  "name": "string",
  "instructions": "string",
  "prepTimeMinutes": "number",
  "cookTimeMinutes": "number",
  "servings": "number",
  "portionSize": "number",
  "caloriesPerPortion": "number",
  "difficulty": "EASY | MEDIUM | HARD",
  "isPublic": "boolean",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)",
  "creatorEmail": "string",
  "createdBy": "string",
  "recipeIngredients": [
    {
      "recipeId": "number",
      "ingredientId": "number",
      "quantityIngredient": "number",
      "ingredient": {
        "id": "number",
        "name": "string",
        "unitOfMeasure": "string",
        "caloriesPerUnit": "number"
      }
    }
  ]
}
```

**Errors**:
- `401 Unauthorized`: Token inválido ou ausente
- `404 Not Found`: Usuário ou ingrediente não encontrado
- `409 Conflict`: Nome de receita já existe para este usuário

---

### PATCH `/recipes/:id`

Atualiza uma receita existente.

**Autenticação**: Requer JWT

**URL Parameter**: `id` (number) - ID da receita

**Request Body** (todos os campos são opcionais):
```json
{
  "name": "string",
  "instructions": "string",
  "prepTimeMinutes": "number",
  "cookTimeMinutes": "number",
  "servings": "number",
  "portionSize": "number",
  "difficulty": "EASY | MEDIUM | HARD",
  "isPublic": "boolean",
  "ingredients": [
    {
      "ingredientId": "number",
      "quantity": "number"
    }
  ]
}
```

**Nota**: Se `ingredients` for fornecido, a lista completa de ingredientes será substituída. Para remover todos os ingredientes, envie um array vazio.

**Response** (200 OK):
```json
{
  "id": "number",
  "name": "string",
  "instructions": "string",
  "prepTimeMinutes": "number",
  "cookTimeMinutes": "number",
  "servings": "number",
  "portionSize": "number",
  "caloriesPerPortion": "number",
  "difficulty": "EASY | MEDIUM | HARD",
  "isPublic": "boolean",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)",
  "creatorEmail": "string",
  "createdBy": "string",
  "recipeIngredients": [
    {
      "recipeId": "number",
      "ingredientId": "number",
      "quantityIngredient": "number",
      "ingredient": {
        "id": "number",
        "name": "string",
        "unitOfMeasure": "string",
        "caloriesPerUnit": "number"
      }
    }
  ]
}
```

**Errors**:
- `401 Unauthorized`: Token inválido ou ausente
- `403 Forbidden`: Usuário não é o dono da receita
- `404 Not Found`: Receita, usuário ou ingrediente não encontrado

---

### GET `/recipes/:id`

Retorna os detalhes de uma receita específica.

**Autenticação**: Não requer (pública)

**URL Parameter**: `id` (number) - ID da receita

**Response** (200 OK):
```json
{
  "id": "number",
  "name": "string",
  "instructions": "string",
  "prepTimeMinutes": "number",
  "cookTimeMinutes": "number",
  "servings": "number",
  "portionSize": "number",
  "caloriesPerPortion": "number",
  "difficulty": "EASY | MEDIUM | HARD",
  "isPublic": "boolean",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)",
  "creatorEmail": "string",
  "createdBy": "string",
  "recipeIngredients": [
    {
      "recipeId": "number",
      "ingredientId": "number",
      "quantityIngredient": "number",
      "ingredient": {
        "id": "number",
        "name": "string",
        "unitOfMeasure": "string",
        "caloriesPerUnit": "number",
        "createdAt": "string (ISO 8601)",
        "updatedAt": "string (ISO 8601)",
        "createdBy": "string",
        "creatorEmail": "string"
      }
    }
  ]
}
```

**Errors**:
- `404 Not Found`: Receita não encontrada

---

## Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Validação falhou |
| 401 | Unauthorized - Token inválido, ausente ou expirado |
| 403 | Forbidden - Usuário não tem permissão |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Recurso já existe ou conflito de dados |
| 500 | Internal Server Error - Erro no servidor |

---

## Exemplos de Uso

### Criar conta e fazer login

```bash
# 1. Criar conta
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'

# 2. Fazer login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'

# Salvar o accessToken retornado
```

### Criar uma receita

```bash
curl -X POST http://localhost:3000/recipes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu-token>" \
  -d '{
    "name": "Arroz com Feijão",
    "instructions": "Cozinhe o arroz e o feijão separadamente",
    "prepTimeMinutes": 10,
    "cookTimeMinutes": 30,
    "servings": 2,
    "difficulty": "EASY",
    "ingredients": [
      { "ingredientId": 1, "quantity": 200 },
      { "ingredientId": 2, "quantity": 150 }
    ]
  }'
```

### Buscar uma receita

```bash
curl -X GET http://localhost:3000/recipes/1
```

### Atualizar uma receita

```bash
curl -X PATCH http://localhost:3000/recipes/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu-token>" \
  -d '{
    "servings": 4,
    "ingredients": [
      { "ingredientId": 1, "quantity": 400 },
      { "ingredientId": 2, "quantity": 300 }
    ]
  }'
```

---

## Validations

A API usa **class-validator** para validação dos DTOs com as seguintes configurações globais:

- `transform`: Transforma automaticamente o payload para instância do DTO
- `whitelist`: Remove propriedades não definidas no DTO
- `forbidNonWhitelisted`: Retorna erro se propriedades não definidas forem enviadas

Campos marcados como `opcional` podem ser omitidos na requisição. Campos sem essa marca são obrigatórios.

---

## Enums

### Gender
- `MALE`
- `FEMALE`
- `OTHER`

### UnitSystem
- `METRIC` (kg, cm)
- `IMPERIAL` (lb, in)

### ActivityLevel
- `SEDENTARY` - Pouco ou nenhum exercício
- `LIGHTLY_ACTIVE` - Exercício leve 1-3 dias/semana
- `MODERATELY_ACTIVE` - Exercício moderado 3-5 dias/semana
- `VERY_ACTIVE` - Exercício pesado 6-7 dias/semana
- `EXTRA_ACTIVE` - Exercício muito pesado ou trabalho físico

### UserStatus
- `ACTIVE`
- `INACTIVE`

### RecipeDifficulty
- `EASY`
- `MEDIUM`
- `HARD`

---

**Última atualização**: 2025-01-15
