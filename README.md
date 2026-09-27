# Meu Projeto Integrador

Projeto organizado em backend, frontend, testes e documentacao.

## Estrutura

- `backend/`: API Node.js com Express e TypeScript.
- `frontend/`: aplicacao React com Vite e TypeScript.
- `tests/e2e/`: testes end-to-end e de integracao.
- `docs/`: documentacao, diagramas e materiais do projeto.

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
