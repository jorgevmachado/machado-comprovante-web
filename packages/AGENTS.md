# Packages compartilhados

## Limites e dependências

Packages em `packages/` são consumidos via npm workspaces e devem expor APIs públicas de forma intencional pelo entrypoint e pelo campo `exports` do `package.json`.

- `apps/finance` pode depender dos packages; packages compartilhados não devem importar de aplicações.
- `ui` pode consumir `theme`, `i18n`, `icons`, `shared` e, durante a migração, `utils`.
- `theme`, `i18n` e `icons` não dependem de `ui`; `shared` permanece independente de React e Next.js.
- Configurações compartilhadas permanecem focadas em tooling; não mova lógica de produto para elas.
- Antes de alterar dependências, exports ou build, verifique os consumidores e a ordem de tarefas no Turbo.

## Desenvolvimento

Os packages usam TypeScript e Jest. Os scripts são por workspace; confira o `package.json` do pacote para saber quais existem. Comandos típicos:

```bash
npm exec turbo run build -- --filter=@machado-repo/<package>
npm exec turbo run test -- --filter=@machado-repo/<package>
npm exec turbo run lint -- --filter=@machado-repo/<package>
```

## Índice

- UI/design system: [ui/AGENTS.md](ui/AGENTS.md)
- Primitivos TypeScript: [shared/AGENTS.md](shared/AGENTS.md)
- Traduções: [i18n/AGENTS.md](i18n/AGENTS.md)
- Tokens: [theme/AGENTS.md](theme/AGENTS.md)
- Inventário de ícones: [icons/AGENTS.md](icons/AGENTS.md)
- Utilitários legados: [utils/AGENTS.md](utils/AGENTS.md)

Configurações de build/lint/teste estão em `eslint-config`, `jest-config`, `tailwind-config` e `typescript-config`; verifique os consumidores antes de mudar padrões compartilhados.
