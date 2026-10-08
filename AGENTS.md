# Machado Comprovante Web

## Visão geral

Monorepo npm workspaces + Turborepo com TypeScript, React 19 e Next.js 16. `apps/finance` é a aplicação ativa; os packages reutilizáveis e de configuração ficam em `packages/`. Consulte os arquivos locais `apps/finance/AGENTS.md` e `packages/AGENTS.md` antes de alterar esses diretórios.

## Setup e comandos

Use Node.js `24.18.0` (`.nvmrc`) e npm `11.16.0` (`devEngines.packageManager`).

```bash
npm ci
npm run build
npm run lint
npm test
npm run check-types
npm run dev --workspace=finance
npm run build -- --filter=finance...
```

Configure `API_BASE_URL` para a API de finanças. Consulte `apps/finance/.env.example`; em produção ela é obrigatória.

## Convenções universais

- Preserve os limites entre aplicação, UI reutilizável, domínio compartilhado e packages de configuração.
- Prefira TypeScript estrito, tipos explícitos em APIs públicas e `unknown` no lugar de `any` quando adequado.
- Siga os padrões existentes de formatação e nomenclatura no diretório alterado.
- Pesquise usos e exports existentes antes de introduzir duplicatas ou alterar APIs públicas.
- Mantenha testes perto do package ou feature que validam; siga Jest e `packages/jest-config`.
- Altere apenas o escopo necessário e não reverta mudanças preexistentes no worktree.

## Segurança e configuração

- Nunca adicione tokens, credenciais, `.env.local` ou dados pessoais ao repositório.
- Mantenha arquivos de ambiente locais; atualize `.env.example` somente com nomes e valores seguros para exemplo.
- Faça chamadas ao backend através dos serviços server-side existentes e mantenha os tokens de sessão fora do cliente.

## Índice JIT

### Estrutura

- App Finance: `apps/finance/` → [apps/finance/AGENTS.md](apps/finance/AGENTS.md)
- Packages: `packages/` → [packages/AGENTS.md](packages/AGENTS.md)
- UI: `packages/ui/` → [packages/ui/AGENTS.md](packages/ui/AGENTS.md)
- TypeScript compartilhado: `packages/shared/` → [packages/shared/AGENTS.md](packages/shared/AGENTS.md)
- Internacionalização: `packages/i18n/` → [packages/i18n/AGENTS.md](packages/i18n/AGENTS.md)
- Tema: `packages/theme/` → [packages/theme/AGENTS.md](packages/theme/AGENTS.md)
- Ícones: `packages/icons/` → [packages/icons/AGENTS.md](packages/icons/AGENTS.md)
- Utilitários legados: `packages/utils/` → [packages/utils/AGENTS.md](packages/utils/AGENTS.md)

### Localização rápida

```bash
rg -n "symbolName" apps/finance packages
rg -n "export (default )?function|forwardRef" packages/ui/src
rg -n "export async function (GET|POST|PUT|DELETE)" apps/finance/app/api
find apps/finance packages -type f \( -name '*.test.ts' -o -name '*.test.tsx' \)
```

## Conclusão de mudanças

Execute as verificações relevantes para os workspaces afetados; para alterações transversais, use os comandos do monorepo. Mudanças de comportamento devem incluir testes. Mudanças de API pública precisam atualizar os exports e seus consumidores.
