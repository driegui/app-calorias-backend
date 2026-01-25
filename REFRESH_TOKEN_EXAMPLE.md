# Refresh Token - Exemplos de Uso

## Rota Criada

### POST /auth/refresh

Gera um novo access token e refresh token a partir de um refresh token válido.

## Estrutura da Requisição

```json
{
  "refreshToken": "seu_refresh_token_aqui"
}
```

## Estrutura da Resposta

```json
{
  "accessToken": "novo_access_token",
  "refreshToken": "novo_refresh_token",
  "expiresAt": "2026-01-25T11:13:00.000Z",
  "refreshExpiresAt": "2026-02-01T10:13:00.000Z"
}
```

## Fluxo Completo de Autenticação

### 1. Login (obter tokens iniciais)

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "senha123"
  }'
```

**Resposta:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2026-01-25T11:13:00.000Z",
  "refreshExpiresAt": "2026-02-01T10:13:00.000Z"
}
```

### 2. Refresh Token (renovar tokens)

Quando o `accessToken` expirar, use o `refreshToken` para obter novos tokens:

```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**Resposta:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2026-01-25T12:13:00.000Z",
  "refreshExpiresAt": "2026-02-02T11:13:00.000Z"
}
```

## Tratamento de Erros

### Token Inválido ou Expirado

```bash
# Status: 401 Unauthorized
{
  "message": "Invalid refresh token",
  "statusCode": 401
}
```

## Arquitetura

A funcionalidade de refresh token foi implementada com módulos separados para melhor organização e separação de responsabilidades:

```
src/auth/
├── auth.controller.ts         # Rota de login
├── auth.service.ts            # Lógica de autenticação
├── auth.module.ts
├── dto/
│   ├── sign-in.dto.ts
│   └── refresh-token.dto.ts   # DTO para validação
├── generate-tokens/           # Service isolado para geração de tokens
│   ├── generate-tokens.service.ts  # Lógica de geração de tokens (método execute)
│   └── generate-tokens.module.ts
└── refresh-token/
    ├── refresh-token.controller.ts  # Rota de refresh
    ├── refresh-token.service.ts     # Lógica de refresh token (método execute)
    └── refresh-token.module.ts      # Módulo dedicado
```

### Benefícios da Arquitetura

- ✅ **GenerateTokensService isolado**: Service dedicado apenas para geração de tokens, reutilizável
- ✅ **Método execute padronizado**: Todos os services usam o método `execute` como padrão
- ✅ **Separação de responsabilidades**: Cada módulo tem uma responsabilidade específica
- ✅ **Sem dependências circulares**: AuthModule e RefreshTokenModule importam GenerateTokensModule
- ✅ **Reutilização de código**: AuthService e RefreshTokenService usam o mesmo GenerateTokensService

## Configuração

Os tempos de expiração são configurados através de variáveis de ambiente no arquivo `.env`:

```env
JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=60m          # Access token expira em 60 minutos
JWT_REFRESH_EXPIRES_IN=7d   # Refresh token expira em 7 dias
```
