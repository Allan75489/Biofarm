# BioSaúde — Backend

API REST em Node.js + Express + PostgreSQL para o sistema BioSaúde.

## Stack

- Node.js + Express
- PostgreSQL (driver `pg`, sem ORM)
- JWT para autenticação, bcrypt para hash de senhas
- Zod para validação de entrada
- Arquitetura em camadas: `routes → controllers → services → repositories → PostgreSQL`

## Estrutura

```
src/
├── config/        # conexão com o banco e variáveis de ambiente
├── controllers/    # recebem req/res e chamam os services
├── middlewares/    # auth (JWT), roles, validação, tratamento de erros
├── routes/         # define os endpoints
├── services/       # regra de negócio
├── repositories/   # única camada que fala SQL
├── validators/      # schemas Zod
├── utils/           # helpers (jwt, status de estoque, AppError...)
├── app.js           # monta o Express
└── server.js        # sobe o servidor
```

## Como rodar

1. Tenha um PostgreSQL rodando localmente (ou em container).
2. Copie o arquivo de variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
   Preencha `DB_*` com suas credenciais e defina um `JWT_SECRET` forte.
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Rode as migrations (cria as tabelas):
   ```bash
   npm run migrate
   ```
5. Rode o seed (cria categorias padrão + usuário admin):
   ```bash
   npm run seed
   ```
   Por padrão cria `admin@biosaude.com` / `admin123` — **troque a senha depois de logar**.
6. Suba a API:
   ```bash
   npm run dev   # com reload automático (nodemon)
   # ou
   npm start
   ```

A API sobe em `http://localhost:5000` (ou na porta definida em `PORT`).

## Endpoints principais

| Recurso | Base |
|---|---|
| Autenticação | `POST /api/auth/login` |
| Usuários | `/api/users` |
| Categorias | `/api/categories` |
| Produtos | `/api/products` |
| Estoque | `/api/stock` |
| Pedidos | `/api/orders` |
| Dashboard | `/api/dashboard` |

Todas as rotas (exceto `/api/auth/login`) exigem o header:
```
Authorization: Bearer <token>
```

Rotas administrativas (cadastro/edição/exclusão de produtos, usuários, categorias, ajuste de estoque, status de pedidos e dashboard) exigem que o usuário logado tenha `role = ADMIN`.

## Regra de status do estoque

Mesma regra já usada no frontend (`frontend/assets/js/estoque.js`):
- `quantity <= 10` → `CRITICO`
- `quantity <= 60` → `BAIXO`
- `quantity > 60` → `EM_ESTOQUE`

## Fluxo de criação de pedido

Ao criar um pedido (`POST /api/orders`), o backend, dentro de uma única transação:
1. Verifica o estoque disponível de cada item;
2. Decrementa o estoque;
3. Cria o pedido e os itens.

Se qualquer item não tiver estoque suficiente, a transação inteira é revertida e nenhuma alteração é salva.
