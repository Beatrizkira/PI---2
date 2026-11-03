# Projeto Integrador II

Projeto organizado em backend, frontend, testes e documentacao.

## Estrutura

- `backend/`: API Node.js com Express e TypeScript.
- `frontend/`: aplicacao React com Vite e TypeScript.
- `tests/e2e/`: testes end-to-end e de integracao.
- `docs/`: documentacao, diagramas e materiais do projeto.

### Banco de dados

O schema relacional fica em `backend/prisma/schema.prisma` e usa PostgreSQL.
Ele cobre catalogo, categorias, tags, imagens, estoque, carrinho, lista de
desejos, comparacao, cupons e pedidos. O seed aproveita o catalogo atual em
`frontend/src/data/Product.json`.

```bash
cd backend
cp .env.development.example .env.development
# ajuste DATABASE_URL conforme o PostgreSQL local
npm install
npm run db:generate
npm run db:migrate -- --name initial
npm run db:seed
```

## Ambientes

Cada parte do projeto possui configuracoes separadas para desenvolvimento e producao. Copie os arquivos `.env.*.example` para os nomes correspondentes sem o sufixo `.example` e ajuste os valores locais.

### Backend

```bash
cd backend
npm install
npm run dev
```

Para producao:

```bash
npm run start:prod
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Para gerar e visualizar a versao de producao:

```bash
npm run build
npm run preview
```
