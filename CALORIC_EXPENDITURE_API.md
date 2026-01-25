# Cálculo de Gasto Calórico Diário

## Rota Criada

### GET /users/caloric-expenditure

Calcula o gasto calórico diário de um usuário usando a **Equação de Mifflin-St Jeor** (padrão científico recomendado pela Academy of Nutrition and Dietetics).

🔒 **Rota Protegida**: Requer autenticação (Bearer Token)

## Parâmetros de Query

| Parâmetro | Tipo | Descrição | Valores Aceitos | Exemplo |
|-----------|------|-----------|-----------------|---------|
| `weight` | number | Peso em quilogramas | 30-300 kg | 75 |
| `height` | number | Altura em centímetros | 50-300 cm | 175 |
| `age` | number | Idade em anos | 1-150 | 30 |
| `gender` | enum | Gênero biológico | `MALE`, `FEMALE` | MALE |
| `activityLevel` | enum | Nível de atividade física | `SEDENTARY`, `ACTIVE`, `VERY_ACTIVE` | ACTIVE |

## Níveis de Atividade Física (PAL)

### SEDENTARY (Fator 1.2)
- Estilo de vida típico de escritório
- Pouco ou nenhum exercício
- Deslocação motorizada
- Lazer passivo (muito tempo sentado)
- **Exemplo**: Programador, bancário, trabalho administrativo

### ACTIVE (Fator 1.55)
- Exercício moderado 3-5 vezes por semana
- Caminhada rápida, bicicleta, natação
- 30-60 minutos de atividade física regular
- **Exemplo**: Praticante de academia regular, professor ativo

### VERY_ACTIVE (Fator 1.725)
- Exercício intenso 6-7 dias por semana
- Mais de 60 minutos de atividade física diária
- Trabalho físico pesado
- **Exemplo**: Atleta, instrutor de fitness, trabalhador da construção

## Resposta

```json
{
  "bmr": 1830,
  "tdee": 2837,
  "activityFactor": 1.55
}
```

**Campos:**
- `bmr` (Basal Metabolic Rate): Taxa Metabólica Basal - gasto calórico em repouso absoluto
- `tdee` (Total Daily Energy Expenditure): Gasto Energético Total Diário - incluindo atividade física
- `activityFactor`: Fator multiplicador aplicado (PAL)

## Exemplos de Uso

### Exemplo 1: Homem Sedentário

```bash
curl -X GET "http://localhost:3000/users/caloric-expenditure?weight=90&height=180&age=40&gender=MALE&activityLevel=SEDENTARY" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

**Resposta:**
```json
{
  "bmr": 1830,
  "tdee": 2196,
  "activityFactor": 1.2
}
```

**Interpretação:**
- Este homem gasta 1830 kcal em repouso absoluto
- Com estilo de vida sedentário, gasta aproximadamente 2196 kcal por dia
- Para perder peso: consumir menos de 2196 kcal/dia
- Para manter peso: consumir ~2196 kcal/dia

### Exemplo 2: Mulher Ativa

```bash
curl -X GET "http://localhost:3000/users/caloric-expenditure?weight=65&height=165&age=28&gender=FEMALE&activityLevel=ACTIVE" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

**Resposta:**
```json
{
  "bmr": 1431,
  "tdee": 2218,
  "activityFactor": 1.55
}
```

**Cálculo Manual:**
- TMB = (10 × 65) + (6.25 × 165) - (5 × 28) - 161
- TMB = 650 + 1031.25 - 140 - 161 = 1380 kcal
- TDEE = 1380 × 1.55 = 2139 kcal

### Exemplo 3: Homem Muito Ativo

```bash
curl -X GET "http://localhost:3000/users/caloric-expenditure?weight=85&height=185&age=25&gender=MALE&activityLevel=VERY_ACTIVE" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

**Resposta:**
```json
{
  "bmr": 1971,
  "tdee": 3400,
  "activityFactor": 1.725
}
```

## Fórmula Científica Utilizada

### Equação de Mifflin-St Jeor (1990)

**Homens:**
```
TMB = (10 × Peso_kg) + (6.25 × Altura_cm) - (5 × Idade) + 5
```

**Mulheres:**
```
TMB = (10 × Peso_kg) + (6.25 × Altura_cm) - (5 × Idade) - 161
```

**Gasto Total:**
```
TDEE = TMB × PAL
```

Onde PAL (Physical Activity Level) é o fator de atividade física.

## Precisão e Margem de Erro

- ✅ A equação de Mifflin-St Jeor prevê o gasto real dentro de **±10%** em 70-80% dos casos
- ⚠️ Fatores que podem causar desvios:
  - Composição corporal atípica (muito musculoso ou muita gordura)
  - Condições da tireoide (hipo/hipertiroidismo)
  - Genética individual (proteínas mitocondriais)
  - Histórico de dietas restritivas (termogênese adaptativa)
  - Medicamentos que afetam o metabolismo

## Validações Aplicadas

A API valida automaticamente:
- ✅ Peso entre 30-300 kg
- ✅ Altura entre 50-300 cm
- ✅ Idade entre 1-150 anos
- ✅ Gênero válido (MALE ou FEMALE)
- ✅ Nível de atividade válido (SEDENTARY, ACTIVE, VERY_ACTIVE)

## Erros Comuns

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
**Solução**: Forneça um token de autenticação válido no header Authorization.

### 400 Bad Request - Parâmetro Inválido
```json
{
  "statusCode": 400,
  "message": [
    "weight must not be less than 30",
    "gender must be one of the following values: MALE, FEMALE"
  ],
  "error": "Bad Request"
}
```
**Solução**: Verifique se todos os parâmetros estão no formato correto.

## Uso Prático

### Para Perda de Peso
- Calcule seu TDEE
- Consuma 300-500 kcal abaixo do TDEE para perda gradual
- Consuma 500-750 kcal abaixo do TDEE para perda mais rápida

### Para Ganho de Massa Muscular
- Calcule seu TDEE
- Consuma 300-500 kcal acima do TDEE
- Combine com treino de força

### Para Manutenção
- Consuma aproximadamente o valor do TDEE calculado

## Referências Científicas

1. Mifflin, M. D., et al. (1990). "A new predictive equation for resting energy expenditure in healthy individuals." *The American Journal of Clinical Nutrition*, 51(2), 241-247.

2. Academy of Nutrition and Dietetics. *"Evidence Analysis Library: Predictive Equations for Energy."*

3. WHO/FAO/UNU Expert Consultation. (2004). *Human energy requirements.*

---

**Nota**: Este cálculo fornece uma **estimativa**. Para necessidades clínicas precisas, recomenda-se calorimetria indireta profissional.
