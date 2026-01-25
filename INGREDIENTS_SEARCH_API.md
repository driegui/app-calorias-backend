# API de Busca de Ingredientes

## Rota Criada

### GET /ingredients/search

Busca ingredientes por nome usando filtro parcial (case-insensitive).

🔒 **Rota Protegida**: Requer autenticação (Bearer Token)

## Parâmetros de Query

| Parâmetro | Tipo | Descrição | Validação | Exemplo |
|-----------|------|-----------|-----------|---------|
| `name` | string | Filtro de busca por nome | Mínimo 2 caracteres | `tomate` |

## Comportamento da Busca

A busca é **case-insensitive** e usa **LIKE** com wildcards, ou seja:
- Busca por `"tom"` encontra: "Tomate", "Tomate Cereja", "TOMATE"
- Busca por `"queijo"` encontra: "Queijo Mussarela", "queijo prato", "QUEIJO"
- Resultados são ordenados alfabeticamente

## Resposta

Retorna um array de ingredientes que correspondem ao filtro:

```json
[
  {
    "id": 1,
    "name": "Tomate",
    "unitOfMeasure": "grams",
    "caloriesPerUnit": 0.18,
    "createdAt": "2026-01-25T14:30:00.000Z",
    "updatedAt": "2026-01-25T14:30:00.000Z",
    "createdBy": "Admin",
    "creatorEmail": "admin@example.com"
  },
  {
    "id": 5,
    "name": "Tomate Cereja",
    "unitOfMeasure": "units",
    "caloriesPerUnit": 3.5,
    "createdAt": "2026-01-25T14:35:00.000Z",
    "updatedAt": "2026-01-25T14:35:00.000Z",
    "createdBy": "Admin",
    "creatorEmail": "admin@example.com"
  }
]
```

## Exemplos de Uso

### Exemplo 1: Buscar ingredientes com "tomate"

```bash
curl -X GET "http://localhost:3000/ingredients/search?name=tomate" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

**Resposta:**
```json
[
  {
    "id": 1,
    "name": "Tomate",
    "unitOfMeasure": "grams",
    "caloriesPerUnit": 0.18,
    "createdAt": "2026-01-25T14:30:00.000Z",
    "updatedAt": "2026-01-25T14:30:00.000Z",
    "createdBy": null,
    "creatorEmail": null
  },
  {
    "id": 5,
    "name": "Tomate Cereja",
    "unitOfMeasure": "units",
    "caloriesPerUnit": 3.5,
    "createdAt": "2026-01-25T14:35:00.000Z",
    "updatedAt": "2026-01-25T14:35:00.000Z",
    "createdBy": null,
    "creatorEmail": null
  }
]
```

### Exemplo 2: Buscar ingredientes com "ar" (encontra arroz, farinha, etc)

```bash
curl -X GET "http://localhost:3000/ingredients/search?name=ar" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

**Possível Resposta:**
```json
[
  {
    "id": 10,
    "name": "Arroz",
    "unitOfMeasure": "grams",
    "caloriesPerUnit": 1.3,
    ...
  },
  {
    "id": 15,
    "name": "Farinha de Trigo",
    "unitOfMeasure": "grams",
    "caloriesPerUnit": 3.64,
    ...
  }
]
```

### Exemplo 3: Sem resultados

```bash
curl -X GET "http://localhost:3000/ingredients/search?name=xyz123" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

**Resposta:**
```json
[]
```

## Validações

### MIN LENGTH: Nome deve ter pelo menos 2 caracteres

**Request:**
```bash
curl -X GET "http://localhost:3000/ingredients/search?name=a" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

**Resposta (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": [
    "Name filter must be at least 2 characters long"
  ],
  "error": "Bad Request"
}
```

### REQUIRED: Nome é obrigatório

**Request:**
```bash
curl -X GET "http://localhost:3000/ingredients/search" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

**Resposta (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": [
    "name must be a string",
    "name should not be empty"
  ],
  "error": "Bad Request"
}
```

## Erros Comuns

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
**Solução**: Forneça um token de autenticação válido no header Authorization.

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": [
    "Name filter must be at least 2 characters long"
  ],
  "error": "Bad Request"
}
```
**Solução**: Envie um nome com pelo menos 2 caracteres.

## Estrutura do Código

### Repository Method
```typescript
// src/infra/entity/ingredients/ingredients.repository.ts
async search(nameFilter: string): Promise<Ingredient[]> {
  return this.typeOrmRepository
    .createQueryBuilder('ingredient')
    .where('LOWER(ingredient.name) LIKE LOWER(:nameFilter)', {
      nameFilter: `%${nameFilter}%`,
    })
    .orderBy('ingredient.name', 'ASC')
    .getMany();
}
```

### Service
```typescript
// src/infra/entity/ingredients/search-ingredients/search-ingredients.service.ts
@Injectable()
export class SearchIngredientsService {
  constructor(private readonly ingredientsRepository: IngredientsRepository) { }

  async execute(searchDto: SearchIngredientsDto): Promise<Ingredient[]> {
    return this.ingredientsRepository.search(searchDto.name);
  }
}
```

### Controller
```typescript
// src/infra/entity/ingredients/ingredients.controller.ts
@Controller('ingredients')
export class IngredientsController {
  @UseGuards(JwtAuthGuard)
  @Get('search')
  search(@Query() searchDto: SearchIngredientsDto) {
    return this.searchIngredientsService.execute(searchDto);
  }
}
```

## Query SQL Gerada

A rota gera uma query SQL similar a:

```sql
SELECT * FROM ingredient
WHERE LOWER(ingredient.name) LIKE LOWER('%tomate%')
ORDER BY ingredient.name ASC;
```

## Performance

- ✅ **Índice Recomendado**: Criar índice na coluna `name` para melhorar performance
- ✅ **Case-Insensitive**: Usa LOWER() para busca sem distinção de maiúsculas/minúsculas
- ✅ **Ordenação**: Resultados ordenados alfabeticamente
- ⚠️ **Full Table Scan**: LIKE com wildcard inicial (`%...`) pode causar full table scan em tabelas grandes

### Criando Índice (Opcional)
```sql
CREATE INDEX idx_ingredient_name ON ingredient(LOWER(name));
```

## Casos de Uso

1. **Autocomplete**: Use esta rota para implementar autocomplete no frontend
2. **Busca de Ingredientes**: Usuário digita parte do nome e vê sugestões
3. **Validação**: Verificar se ingrediente já existe antes de criar
4. **Listagem Filtrada**: Mostrar apenas ingredientes relevantes

## Próximos Passos

- 🔲 Adicionar paginação (limit/offset)
- 🔲 Adicionar filtros adicionais (unidade de medida, faixa de calorias)
- 🔲 Incluir busca por aliases (nomes alternativos)
- 🔲 Adicionar cache para buscas frequentes

---

**Status**: ✅ Implementado e testado  
**Autenticação**: Obrigatória (JWT)  
**Método HTTP**: GET  
**Endpoint**: `/ingredients/search`
