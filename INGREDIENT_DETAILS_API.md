# API de Detalhes de Ingrediente

## Rota Criada

### GET /ingredients/:id

Retorna os detalhes completos de um ingrediente específico, incluindo seus nomes alternativos (aliases).

🔒 **Rota Protegida**: Requer autenticação (Bearer Token)

## Parâmetros de Rota

| Parâmetro | Tipo | Descrição | Exemplo |
|-----------|------|-----------|---------|
| `id` | number | ID do ingrediente | `1` |

## Resposta de Sucesso

Retorna um objeto com os detalhes completos do ingrediente:

```json
{
  "id": 1,
  "name": "Tomate",
  "unitOfMeasure": "grams",
  "caloriesPerUnit": 0.18,
  "createdAt": "2026-01-25T14:30:00.000Z",
  "updatedAt": "2026-01-25T14:30:00.000Z",
  "createdBy": "Admin",
  "creatorEmail": "admin@example.com",
  "aliases": [
    {
      "id": 1,
      "ingredientId": 1,
      "aliasName": "Tomate Vermelho",
      "createdAt": "2026-01-25T14:31:00.000Z",
      "updatedAt": "2026-01-25T14:31:00.000Z",
      "createdBy": "Admin",
      "creatorEmail": "admin@example.com"
    },
    {
      "id": 2,
      "ingredientId": 1,
      "aliasName": "Tomatinho",
      "createdAt": "2026-01-25T14:32:00.000Z",
      "updatedAt": "2026-01-25T14:32:00.000Z",
      "createdBy": "Admin",
      "creatorEmail": "admin@example.com"
    }
  ]
}
```

## Campos da Resposta

### Ingrediente Principal

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | number | ID único do ingrediente |
| `name` | string | Nome principal do ingrediente |
| `unitOfMeasure` | string | Unidade de medida (grams, ml, units, etc) |
| `caloriesPerUnit` | number | Calorias por unidade |
| `createdAt` | string (ISO 8601) | Data de criação |
| `updatedAt` | string (ISO 8601) | Data de última atualização |
| `createdBy` | string / null | Nome do criador |
| `creatorEmail` | string / null | Email do criador |
| `aliases` | array | Lista de nomes alternativos |

### Aliases (Nomes Alternativos)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | number | ID do alias |
| `ingredientId` | number | ID do ingrediente pai |
| `aliasName` | string | Nome alternativo |
| `createdAt` | string (ISO 8601) | Data de criação |
| `updatedAt` | string (ISO 8601) | Data de última atualização |
| `createdBy` | string / null | Nome do criador |
| `creatorEmail` | string / null | Email do criador |

## Exemplos de Uso

### Exemplo 1: Buscar ingrediente por ID

```bash
curl -X GET "http://localhost:3000/ingredients/1" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "name": "Tomate",
  "unitOfMeasure": "grams",
  "caloriesPerUnit": 0.18,
  "createdAt": "2026-01-25T14:30:00.000Z",
  "updatedAt": "2026-01-25T14:30:00.000Z",
  "createdBy": null,
  "creatorEmail": null,
  "aliases": [
    {
      "id": 1,
      "ingredientId": 1,
      "aliasName": "Tomate Vermelho",
      "createdAt": "2026-01-25T14:31:00.000Z",
      "updatedAt": "2026-01-25T14:31:00.000Z",
      "createdBy": null,
      "creatorEmail": null
    }
  ]
}
```

### Exemplo 2: Ingrediente sem aliases

```bash
curl -X GET "http://localhost:3000/ingredients/5" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

**Resposta (200 OK):**
```json
{
  "id": 5,
  "name": "Arroz Integral",
  "unitOfMeasure": "grams",
  "caloriesPerUnit": 1.11,
  "createdAt": "2026-01-25T15:00:00.000Z",
  "updatedAt": "2026-01-25T15:00:00.000Z",
  "createdBy": null,
  "creatorEmail": null,
  "aliases": []
}
```

## Tratamento de Erros

### 404 Not Found - Ingrediente não existe

```bash
curl -X GET "http://localhost:3000/ingredients/9999" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

**Resposta (404):**
```json
{
  "statusCode": 404,
  "message": "Ingredient with ID 9999 not found",
  "error": "Not Found"
}
```

### 400 Bad Request - ID inválido

```bash
curl -X GET "http://localhost:3000/ingredients/abc" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

**Resposta (400):**
```json
{
  "statusCode": 400,
  "message": "Validation failed (numeric string is expected)",
  "error": "Bad Request"
}
```

### 401 Unauthorized - Sem autenticação

```bash
curl -X GET "http://localhost:3000/ingredients/1"
```

**Resposta (401):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## Validações Aplicadas

- ✅ **ParseIntPipe**: ID deve ser um número inteiro válido
- ✅ **NotFoundException**: Retorna 404 se ingrediente não existe
- ✅ **JwtAuthGuard**: Autenticação obrigatória

## Estrutura do Código

### Service
```typescript
// get-ingredient-details.service.ts
@Injectable()
export class GetIngredientDetailsService {
  constructor(private readonly ingredientsRepository: IngredientsRepository) { }

  async execute(id: number): Promise<Ingredient> {
    const ingredient = await this.ingredientsRepository.findById(id);

    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID ${id} not found`);
    }

    return ingredient;
  }
}
```

### Repository
```typescript
// ingredients.repository.ts
async findById(id: number): Promise<Ingredient | null> {
  return this.typeOrmRepository.findOne({
    where: { id },
    relations: ['aliases'], // ← Inclui aliases automaticamente
  });
}
```

### Controller
```typescript
// ingredients.controller.ts
@Controller('ingredients')
export class IngredientsController {
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getDetails(@Param('id', ParseIntPipe) id: number) {
    return this.getIngredientDetailsService.execute(id);
  }
}
```

## Query SQL Gerada

A rota gera queries SQL similares a:

```sql
-- Busca o ingrediente
SELECT * FROM ingredient WHERE id = 1;

-- Busca os aliases (JOIN automático do TypeORM)
SELECT * FROM "ingredientAlias" 
WHERE "ingredientId" = 1;
```

## Casos de Uso

1. **Visualização de Detalhes**: Mostrar informações completas de um ingrediente
2. **Edição de Ingrediente**: Carregar dados para formulário de edição
3. **Autocomplete com Aliases**: Sugerir nomes alternativos
4. **Validação de Dados**: Verificar informações antes de usar em receita

## Relacionamentos Incluídos

Esta rota retorna:
- ✅ **Ingrediente**: Dados principais
- ✅ **Aliases**: Nomes alternativos
- ❌ **Receitas**: Não incluídas (use rota específica se necessário)
- ❌ **Logs de Consumo**: Não incluídos

## Performance

- ✅ **Busca por Primary Key**: Extremamente rápida (índice automático)
- ✅ **Join Otimizado**: TypeORM carrega aliases em uma única query adicional
- ✅ **Eager Loading**: Aliases carregados automaticamente

## Comparação com Outras Rotas

| Rota | Propósito | Retorna Aliases |
|------|-----------|-----------------|
| `GET /ingredients/search?name=x` | Buscar múltiplos ingredientes | ❌ Não |
| `GET /ingredients/:id` | Detalhes de 1 ingrediente | ✅ Sim |

## Próximos Passos

- 🔲 Adicionar rota para listar receitas que usam o ingrediente
- 🔲 Adicionar estatísticas de uso (quantas vezes foi consumido)
- 🔲 Adicionar informações nutricionais adicionais
- 🔲 Implementar cache para ingredientes frequentemente acessados

## Exemplo Completo de Fluxo

### 1. Buscar ingredientes
```bash
GET /ingredients/search?name=tomate
```
→ Retorna lista de ingredientes

### 2. Selecionar e ver detalhes
```bash
GET /ingredients/1
```
→ Retorna detalhes + aliases

### 3. Usar em receita ou log de consumo
```bash
POST /consumption-logs
{
  "ingredientId": 1,
  "quantity": 100
}
```

---

**Status**: ✅ Implementado e testado  
**Autenticação**: Obrigatória (JWT)  
**Método HTTP**: GET  
**Endpoint**: `/ingredients/:id`  
**Retorna**: Ingrediente com aliases
