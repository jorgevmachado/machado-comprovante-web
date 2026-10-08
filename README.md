# Machado Comprovante Web

Aplicação web para organizar comprovantes e pagamentos. O repositório é um monorepo Turborepo: a aplicação Finance é construída com Next.js e consome packages compartilhados de UI, internacionalização e lógica TypeScript.

## Funcionalidades

- Cadastro e consulta de comprovantes, pagamentos, pagadores, beneficiários e categorias.
- Painel financeiro com resumos e gráficos.
- Acesso autenticado e integração com uma API de finanças separada.
- Interface multilíngue em português do Brasil, inglês dos Estados Unidos e espanhol.

## Tecnologias

- Node.js 24 e npm 11.16.0
- TypeScript, React 19 e Next.js 16
- Turborepo e npm workspaces
- Tailwind CSS, Jest e Testing Library

## Estrutura

| Caminho | Responsabilidade |
| --- | --- |
| `apps/finance` | Aplicação Next.js, fluxos de negócio, rotas de API e integração com o backend |
| `packages/ui` | Componentes React reutilizáveis e estilos |
| `packages/i18n` | Recursos e infraestrutura de tradução |
| `packages/theme` | Tokens e configurações visuais |
| `packages/icons` | Abstração centralizada de ícones |
| `packages/shared` | Tipos, value objects e utilitários TypeScript independentes de framework |
| `packages/utils` | Utilitários compartilhados legados |
| `packages/*-config` | Configurações compartilhadas de ESLint, Jest, Tailwind e TypeScript |

## Começando

Use Node.js `24.18.0` (versão registrada em `.nvmrc`) e npm `11.16.0`, conforme exigido pelo repositório.

```bash
npm install --global npm@11.16.0
npm ci
cp apps/finance/.env.example apps/finance/.env.local
```

Configure `API_BASE_URL` no arquivo `apps/finance/.env.local` para apontar para uma API de finanças disponível. Em desenvolvimento, a aplicação usa `http://127.0.0.1:8000` quando a variável não está definida.

Inicie o Finance:

```bash
npm run dev --workspace=finance
```

A aplicação ficará disponível em [http://localhost:3000](http://localhost:3000).

## Comandos

Execute a partir da raiz do repositório:

| Comando | Descrição |
| --- | --- |
| `npm run dev --workspace=finance` | Inicia o servidor de desenvolvimento do Finance |
| `npm run build -- --filter=finance...` | Compila o Finance e os packages dos quais depende |
| `npm run lint` | Executa o lint nos workspaces com essa tarefa |
| `npm test` | Executa os testes dos workspaces com essa tarefa |
| `npm run check-types` | Executa as verificações de tipos configuradas no Turborepo |

Para executar tarefas em um workspace específico, use os filtros do Turborepo, por exemplo: `npm exec turbo run test -- --filter=@machado-repo/ui`.

## Configuração e build de produção

`API_BASE_URL` deve ser uma URL absoluta `http://` ou `https://`. É obrigatória em produção; sem ela, o build ou a inicialização em ambiente de produção falha explicitamente. O backend não faz parte deste repositório e precisa estar acessível pela aplicação.

O build do Finance gera uma saída standalone do Next.js em `apps/finance/.next/standalone`. O workflow de pull requests executa lint, testes e build, e publica um artefato de implantação com a saída standalone, arquivos estáticos e, quando presente, a pasta `public`.
