# Utils legado

## Identidade

Package compartilhado legado em migração gradual para `packages/shared`. Seu conteúdo atual é pequeno; evite ampliar sua responsabilidade.

## Comandos

```bash
npm run build -- --filter=@machado-repo/utils
npm run lint --workspace=@machado-repo/utils
npm test --workspace=@machado-repo/utils -- --runInBand
```

## Padrões de migração

- Antes de modificar ou migrar um utilitário, procure todos os consumidores e verifique entrypoints e testes.
- Para funcionalidade genérica e independente de framework, prefira `packages/shared`; mantenha reexports/compatibilidade quando consumidores ainda usam `utils`.
- Não mova todo o package em uma tarefa não relacionada. Avalie dependências, API pública e direção do grafo antes de cada migração.
- Os módulos atuais ficam em `src/entity/` e `src/object/`; o entrypoint é `src/index.ts`.
- Evite dependências de UI/Next.js e ciclos entre packages.

## Busca e verificação

```bash
rg -n "@machado-repo/utils|from ['\"].*utils" apps packages
rg -n "export" src/index.ts src/**/index.ts
npm run lint --workspace=@machado-repo/utils && npm test --workspace=@machado-repo/utils -- --runInBand
```
