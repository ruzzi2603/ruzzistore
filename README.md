# ArenaGames

Plataforma de informacoes de games e distribuicao de jogos para PC.

## 1) Documentacao tecnica (Sob o Capo)

### Stack (versoes do projeto)

Backend:
- Node.js: nao fixado no repo (recomendado 18+; Next/Nest suportam 18/20)
- NestJS: ^10.x (ver `backend/package.json`)
- Prisma: ^5.22
- Banco: PostgreSQL (Supabase)
- Auth: JWT + bcrypt

Frontend (loja):
- Next.js: ^14.2
- React: ^18.2
- Tailwind: ^4.1

Admin (painel):
- Next.js: 16.1.6
- React: 19.2.3

Servicos externos:
- RAWG API (catalogo)
- Cloudinary (avatars)
- Google OAuth (login social)

### Setup local (dev)

1) Backend
```bash
cd backend
npm install
npm run start:dev
```

2) Frontend (loja)
```bash
cd frontend
npm install
npm run dev
```

3) Admin (opcional)
```bash
cd admin-frontend
npm install
npm run dev
```

### Setup com Docker (se houver)
Se voce quiser usar container, ajuste o `docker-compose.yml` na raiz e execute:
```bash
docker-compose up --build
```

### Variaveis de ambiente (exemplo)

Backend `backend/.env`:
```env
JWT_SECRET=troque_por_um_valor_forte
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=SEU_CLIENT_ID_AQUI
GOOGLE_CLIENT_SECRET=SEU_CLIENT_SECRET_AQUI
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha
DB_NAME=postgres

API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
ADMIN_FRONTEND_URL=http://localhost:3003

DATABASE_URL="postgresql://postgres:sua_senha@db.seu-projeto.supabase.co:5432/postgres?schema=public"
SHADOW_DATABASE_URL="postgresql://postgres:sua_senha@db.seu-projeto.supabase.co:5432/postgres?schema=public"

RAWG_API_KEY=COLOQUE_SUA_CHAVE
RAWG_BASE_URL=https://api.rawg.io/api

ADMIN_EMAIL=seu_email@exemplo.com
```

Frontend `frontend/.env`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=seu_upload_preset
```

Admin `admin-frontend/.env`:
```env
NEXT_PUBLIC_ADMIN_API_URL=http://localhost:3002
```

### Documentacao de API (HTTP)

Base URL (local): `http://localhost:3001`
Autenticacao: `Authorization: Bearer <token>`

#### Auth
`POST /auth/login`
- Body:
```json
{ "email": "user@exemplo.com", "password": "minhaSenha123" }
```
- Response:
```json
{
  "accessToken": "jwt",
  "user": {
    "id": 1,
    "email": "user@exemplo.com",
    "name": "Nome",
    "avatar": "https://...",
    "createdAt": "2026-03-18T00:00:00.000Z"
  }
}
```
- Erros:
`401` email/senha invalidos
`400` payload invalido

`POST /auth/register`
- Body:
```json
{ "name": "Nome", "email": "user@exemplo.com", "password": "Senha123", "avatar": "https://..." }
```
- Response:
```json
{ "id": 1, "email": "user@exemplo.com", "name": "Nome", "avatar": null, "createdAt": "..." }
```
- Erros:
`409` email ja cadastrado
`400` payload invalido

#### Usuarios
`GET /users/me` (auth)
- Response:
```json
{ "id": 1, "name": "Nome", "email": "user@exemplo.com", "avatar": null, "createdAt": "..." }
```

`POST /users/update` (auth)
- Body:
```json
{ "name": "Novo Nome" }
```
- Response:
```json
{ "id": 1, "name": "Novo Nome", "email": "user@exemplo.com", "avatar": null }
```

`POST /users/avatar` (auth)
- Body:
```json
{ "avatar": "https://..." }
```
- Response:
```json
{ "id": 1, "name": "Nome", "email": "user@exemplo.com", "avatar": "https://...", "createdAt": "..." }
```

#### Favoritos
`GET /favorites/ids` (auth)
- Response:
```json
[1, 2, 3]
```

`GET /favorites` (auth)
- Response: lista de jogos favoritados (entidades `Game`)

`POST /favorites/:gameId` (auth)
- Body (opcional, para RAWG/externos):
```json
{
  "game": {
    "title": "Titulo",
    "description": "...",
    "imageUrl": "https://...",
    "platform": "rawg",
    "url": "https://...",
    "isFree": false
  }
}
```
- Response:
Cria ou remove favorito e retorna o registro de favorito.
- Erros:
`400` jogo invalido
`401` sem token

#### Jogos
`GET /games`
- Query params: `search`, `category`, `platform`, `free`, `source`, `page`
- Response: lista paginada/filtrada de jogos

`GET /games/rawg-latest?count=40`
- Response: lista de jogos recentes da RAWG

`GET /games/:id`
- Response: detalhes do jogo local

#### RAWG (proxy)
`GET /rawg/games?page=1`
`GET /rawg/games/:id`
`GET /rawg/games/:id/movies`
`GET /rawg/games/:id/twitch`
`GET /rawg/games/:id/youtube`

### Erros comuns
- `401 Unauthorized`: token ausente/expirado
- `400 Bad Request`: validacao do payload falhou
- `409 Conflict`: email ja registrado
- `500 Internal Server Error`: erro inesperado

### Swagger/OpenAPI e Postman
Swagger UI: http://localhost:3001/api-docs`nPostman: importe ArenaGames.postman_collection.json (na raiz do repo).

### Diagramas de arquitetura (C4 simplificado)

```mermaid
flowchart LR
  User[Usuario] --> FE[Frontend Next.js]
  User --> AD[Admin Next.js]
  FE --> API[Backend NestJS]
  AD --> API
  API --> DB[(MySQL)]
  API --> RAWG[RAWG API]
  FE --> Cloudinary[Cloudinary]
  API --> Google[Google OAuth]
```

## 2) Manutencao e boas praticas

- Atualize as variaveis no `.env` antes de subir em producao.
- Use HTTPS em producao (Vercel/Render ja oferecem por padrao).
- Mantenha `JWT_SECRET` forte e rotacione periodicamente.

---

Se quiser, eu posso gerar um `swagger.json`/OpenAPI automaticamente com Nest ou montar uma colecao Postman.




