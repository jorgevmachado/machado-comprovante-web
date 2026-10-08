# Finance

Aplicação web para gerenciar comprovantes, pagamentos, pagadores, beneficiários e categorias. Construída com Next.js 16, React 19 e TypeScript; a API Next.js funciona como BFF para o backend de finanças.

## Desenvolvimento

Use Node.js `24.18.0` (versão em `.nvmrc`) e npm `11.16.0` (versão exigida pelo monorepo). Instale as dependências na raiz:

```bash
npm ci
cp apps/finance/.env.example apps/finance/.env.local
```

Configure `API_BASE_URL` em `apps/finance/.env.local` para apontar ao backend. Em desenvolvimento, se não estiver definida, o app usa `http://127.0.0.1:8000`.

Inicie o servidor a partir da raiz:

```bash
npm run dev --workspace=finance
```

Abra [http://localhost:3000](http://localhost:3000).

## Comandos

Execute os comandos a partir da raiz do monorepo:

| Comando | Descrição |
| --- | --- |
| `npm run dev --workspace=finance` | Inicia o servidor de desenvolvimento |
| `npm run lint --workspace=finance` | Executa ESLint no Finance |
| `npm run test:coverage --workspace=finance -- --runInBand` | Executa os testes Jest com cobertura |
| `npm run build -- --filter=finance...` | Compila Finance e seus packages dependentes |

As features ficam em `src/features/`, as rotas e páginas do App Router em `app/`, as rotas BFF em `app/api/` e os serviços server-side em `src/server/`.

## Produção

`API_BASE_URL` é obrigatória em produção e deve ser uma URL absoluta HTTP ou HTTPS. Configure-a no ambiente de build e runtime conforme o deploy.

O build usa `output: "standalone"` e gera a aplicação em `apps/finance/.next/standalone`. Para deployment standalone, inclua também `.next/static` e `public` se existir. O workflow de pull request em `.github/workflows/finance-pull-request.yml` executa lint, testes e build, e prepara o artefato de deploy.
