# AGENTS.md

## Visão Geral do Projeto

Este repositório é um **monorepo Turborepo** organizado em aplicações e packages reutilizáveis.

O projeto segue uma separação entre:

- **Aplicações (`apps/`)**: produtos executáveis e documentação.
- **Packages de configuração (`packages/`)**: ferramentas e configurações compartilhadas.
- **Packages reutilizáveis de domínio/UI (`packages/`)**: código compartilhado consumido pelas aplicações e por outros packages.

O principal objetivo ao modificar este repositório é preservar os limites entre os packages, evitar acoplamento desnecessário e manter as funcionalidades compartilhadas reutilizáveis.

---

## Estrutura do Repositório

```text
.
├── apps/
│   ├── docs/
│   └── finance/
│
├── packages/
│   ├── eslint-config/
│   ├── jest-config/
│   ├── tailwind-config/
│   ├── typescript-config/
│   ├── shared/
│   ├── utils/
│   ├── theme/
│   ├── i18n/
│   ├── icons/
│   └── ui/
│
├── package.json
├── turbo.json
└── ...
```

---

# Aplicações

## `apps/docs`

A aplicação `docs` é a **documentação dos componentes e do design system** do projeto.

### Stack

- React
- Storybook
- TypeScript
- Tailwind CSS where applicable
- Components from `packages/ui`

### Responsabilidade

`docs` exists to:

- Document the UI and design system.
- Provide Storybook stories for reusable components.
- Demonstrate component states, variants, accessibility behavior, and usage.
- Serve as a visual development environment for `packages/ui`.
- Provide examples that make component APIs understandable.

### Regras

- Do not put reusable UI implementation directly in `apps/docs`.
- Componentes reutilizáveis pertencem a `packages/ui`.
- As stories pertencem a `apps/docs`.
- Se um componente precisar de um comportamento que deve ser compartilhado pelos consumidores, implemente esse comportamento em `packages/ui` em vez de implementá-lo dentro de uma story do Storybook.
- As stories devem representar usos realistas em vez de detalhes de implementação.
- Ao adicionar or changing a component API, update or create the corresponding Storybook stories.
- Prefira controlled stories when the component has controlled state.
- Stories should cover important states such as:
    - Default
    - Disabled
    - Loading, when applicable
    - Error, when applicable
    - Different variants
    - Different sizes
    - Edge cases
    - Interaction/state changes

---

## `apps/finance`

A aplicação `finance` é o **principal frontend do projeto**.

### Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Packages from the monorepo

### Responsabilidade

`finance` contains application-specific functionality such as:

- Pages and routes
- Application layouts
- Feature-specific business flows
- Server/client composition
- Application state and orchestration
- Integration with backend APIs
- Finance-specific business rules

### Regras

- Do not duplicate functionality that already belongs in a shared package.
- Comportamentos específicos da aplicação devem permanecer em `apps/finance`.
- Componentes genéricos devem ser implementados em `packages/ui`.
- Utilitários genéricos devem ser implementados em `packages/shared` ou migrados de `packages/utils` para `packages/shared` quando apropriado.
- Do not introduce direct dependencies on packages that are intended to be internal dependencies of another package.
- Keep Next.js-specific concerns inside the application unless a package explicitly requires them.
- Evite coupling generic packages to Next.js APIs such as `next/link`, `next/navigation`, or Next-specific server behavior unless the package is explicitly designed for it.

---

# Packages

Packages are divided conceptually into two groups:

1. **Tooling/configuration**
2. **Reusable application code**

---

# Configuration Packages

## `packages/eslint-config`

Configuração compartilhada do ESLint para o monorepo.

### Responsabilidade

- ESLint rules
- Shared linting conventions
- Environment-specific ESLint configurations

### Regras

- Mantenha este package focado em configuração de linting.
- Do not place application logic here.
- Prefira extending existing configurations over duplicating rules.
- As alterações podem afetar todos os packages e aplicações, portanto valide o monorepo inteiro ao modificar regras compartilhadas.

---

## `packages/jest-config`

Configuração compartilhada do Jest.

### Responsabilidade

- Jest base configuration
- React/library test configuration
- Shared transforms
- Module mappings
- Test environment configuration
- Shared test setup

### Regras

- Mantenha a configuração de testes centralizada.
- Evite adding package-specific business logic.
- If a configuration is needed by multiple packages, prefer implementing it here.
- Changes can affect all Jest consumers and must be validated carefully.

---

## `packages/tailwind-config`

Configuração compartilhada do Tailwind CSS.

### Responsabilidade

- Shared Tailwind configuration
- Theme integration
- Shared CSS conventions
- Tailwind plugins/configuration used across the repository

### Regras

- Mantenha tokens visuais e configurações do Tailwind centralizados quando forem realmente compartilhados.
- Do not place React components here.
- Evite application-specific styles.
- Changes must preserve compatibility with consumers such as `packages/ui` and `apps/finance`.

---

## `packages/typescript-config`

Configurações compartilhadas do TypeScript.

### Responsabilidade

- Base TypeScript configuration
- Library configuration
- Application configuration
- Shared compiler conventions

### Regras

- Prefira estender uma configuração existente em vez de duplicar opções do compilador.
- Keep configurations generic and reusable.
- Be careful with changes involving:
    - `module`
    - `moduleResolution`
    - `target`
    - `jsx`
    - `paths`
    - declaration generation
    - strictness

A change here can affect the entire monorepo.

---

# Reusable Packages

## `packages/shared`

`shared` é o **principal package genérico de TypeScript**, destinado a ser compartilhado em todo o repositório.

### Stack

- TypeScript

### Responsabilidade

Este package should contain code that is:

- Generic
- Framework-independent
- Reusable by multiple applications/packages
- Not coupled to React
- Not coupled to Next.js
- Not coupled to a specific application

Exemplos incluem:

- Domain primitives
- Value Objects
- Result types
- Generic types
- Generic validation
- Generic data transformations
- Framework-independent business helpers

### Regras

- Mantenha o package independente de frameworks.
- Não importe React.
- Não importe Next.js.
- Evite browser-specific APIs unless the functionality explicitly requires them.
- Prefira small, composable functions/classes.
- Keep public APIs explicit through package exports.
- Evite expor detalhes de implementação através dos exports.
- New generic functionality should generally go here instead of `packages/utils`.

---

## `packages/utils`

`utils` is a **legacy/shared TypeScript utility package** that is currently being migrated gradually to `packages/shared`.

### Stack

- TypeScript

### Responsabilidade

Atualmente, ele contains reusable utility functions that have not yet been migrated to `shared`.

### Regra de migração

Ao modifying an existing utility:

1. Check whether it should already belong in `packages/shared`.
2. If the utility is generic and framework-independent, prefer migrating it to `shared`.
3. Evite creating new utilities in `utils` unless there is a specific migration or compatibility reason.
4. Preserve backwards compatibility when existing consumers still depend on the old location.
5. Update tests and package exports when moving functionality.

### Importante

Não blindly move everything from `utils` to `shared`.

A migration should consider:

- API stability
- Existing consumers
- Package dependency direction
- Public exports
- Test coverage
- Build configuration

---

## `packages/theme`

`theme` contém as configurações de tema do projeto.

### Stack

- React

### Responsabilidade

Este package contains theme-related definitions and configuration consumed by `packages/ui`.

Exemplos incluem:

- Component theme definitions
- Variants
- Design tokens exposed to UI components
- Light/dark variants
- Semantic visual configurations

### Limite de dependência

`theme` is intended to be consumed by `packages/ui`.

Não make `theme` depend on `ui`.

### Regras

- Keep theme definitions separate from component implementation.
- Do not place complete UI components here.
- Evite application-specific styling.
- Keep theme APIs stable and composable.
- Prefira semantic names over hard-coded component-specific values when appropriate.

---

## `packages/i18n`

`i18n` fornece a funcionalidade de internacionalização do projeto.

### Stack

- React
- i18n tooling

### Responsabilidade

- Translation resources
- Locale definitions
- Translation instances/configuration
- Translation hooks/utilities
- Integration required by `packages/ui`

### Limite de dependência

`i18n` is intended to be consumed by `packages/ui`.

Applications should generally consume internationalization functionality through the UI layer rather than directly depending on internal implementation details of this package.

### Regras

- Mantenha os recursos de tradução organizados por locale.
- Evite application-specific translation behavior.
- Keep locale registration predictable.
- Não acople a implementação de tradução ao Next.js.
- Ao adicionar translation keys, update the relevant locale resources consistently.
- Evite hard-coded user-facing strings in reusable UI components when those strings should be translatable.

---

## `packages/icons`

`icons` é o package centralizado de ícones.

### Stack

- React
- `react-icons`

### Responsabilidade

Ele fornece a consistent abstraction over the icon library used throughout the project.

O package existe para prevent consumers from importing icons directly from multiple places and to provide a centralized icon inventory.

### Regras

- Prefira importar ícones através de `packages/icons`.
- Evite importing `react-icons` directly in consuming packages when the icon is already exposed by `packages/icons`.
- Keep icon naming consistent.
- Do not add application-specific components here.
- Do not put generic UI components here.
- When replacing an icon, preserve the expected component API where possible.

---

## `packages/ui`

`ui` é o **package de User Interface / Design System** do projeto.

Ele é um dos packages mais importantes do repositório.

### Stack

- React
- TypeScript
- Tailwind CSS
- `packages/theme`
- `packages/i18n`
- `packages/icons`
- Other framework-independent shared packages when necessary

### Responsabilidade

`ui` contains reusable UI infrastructure such as:

- Components
- Hooks
- Providers
- UI behavior
- Component state management
- Accessibility behavior
- Component composition
- Design-system abstractions

Exemplos incluem:

- Input
- Textarea
- Button
- Select
- Dropdown
- Navbar
- Sidebar
- Breadcrumb
- Alerts
- Forms
- Providers
- UI hooks

### Dependency boundaries

`ui` may consume:

- `theme`
- `i18n`
- `icons`
- `shared`
- `utils` during the migration period

`theme`, `i18n`, and `icons` should not depend on `ui`.

Evite circular dependencies between reusable packages.

### Regras

- Os componentes devem ser reutilizáveis fora de `apps/finance`.
- Do not import Next.js-specific modules unless absolutely necessary and explicitly justified.
- Não coloque regras de negócio da aplicação dentro dos componentes de UI.
- Prefira composição em vez de componentes grandes com muitas responsabilidades.
- Mantenha o comportamento de acessibilidade dentro do componente quando ele for intrínseco ao componente.
- Components should expose predictable and type-safe APIs.
- Controlled and uncontrolled behavior should be clearly defined.
- Evite hidden state when a component is expected to be controlled.
- Componentes reutilizáveis não devem assumir comportamentos ou estruturas específicas de uma aplicação.
- User-facing text should use the i18n layer when appropriate.
- Icons should use `packages/icons`.
- Styling should use the project's theme/Tailwind conventions.
- Evite duplicating theme definitions inside components.

---

# Direção das Dependências

The repository should follow a dependency direction that keeps low-level packages independent from high-level applications.

A simplified model is:

```text
                    ┌─────────────────┐
                    │   apps/finance  │
                    └────────┬────────┘
                             │
                             ▼
                       ┌───────────┐
                       │    ui     │
                       └─────┬─────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
          ┌────────┐     ┌───────┐      ┌────────┐
          │ theme  │     │ i18n  │      │ icons  │
          └────────┘     └───────┘      └────────┘
                             │
                             │
                       ┌─────▼─────┐
                       │  shared   │
                       └───────────┘
```

O grafo exato de dependências pode evoluir, mas o seguinte princípio deve permanecer:

> **Packages compartilhados de baixo nível não devem depender de aplicações ou packages de nível superior.**

In particular:

- `apps/*` may depend on reusable packages.
- `ui` may depend on `theme`, `i18n`, `icons`, `shared`, and transitional `utils`.
- `theme` must not depend on `ui`.
- `i18n` must not depend on `ui`.
- `icons` must not depend on `ui`.
- `shared` must remain framework-independent.
- Configuration packages should not contain application logic.

---

# Regras Gerais de Desenvolvimento

## TypeScript

Utilize TypeScript em todo o projeto.

Prefira:

- Explicit public types
- Type-safe APIs
- Narrow types
- Discriminated unions where appropriate
- `unknown` instead of `any` when the type is genuinely unknown
- Reusable generic types when they improve clarity

Evite:

- Unnecessary `any`
- Type assertions used to hide design problems
- Duplicated types across packages
- Exporting internal implementation types unnecessarily

---

## React

Siga os padrões modernos do React.

Prefira:

- Functional components
- Hooks
- Composition
- Controlled components when appropriate
- `forwardRef` when ref forwarding is part of the component API
- Explicit component prop types

Evite:

- Unnecessary state
- Effects for derived values
- Components that combine unrelated responsibilities
- Application-specific logic inside reusable UI components

---

## Next.js

Comportamentos específicos do Next.js pertencem principalmente a `apps/finance`.

Be especially careful when importing:

- `next/link`
- `next/navigation`
- `next/server`
- Next.js server-only APIs
- Next.js client-only APIs

A reusable package should remain framework-independent unless there is a clear architectural reason otherwise.

---

# Desenvolvimento de Componentes

Ao criar ou modificar um componente de UI:

1. Determine whether the component belongs in `packages/ui`.
2. Define the public API before implementing internal behavior.
3. Reuse existing theme definitions.
4. Reuse existing icons.
5. Reuse existing shared utilities when appropriate.
6. Keep accessibility behavior in the component.
7. Add or update tests.
8. Add or update Storybook stories in `apps/docs`.
9. Verify controlled/uncontrolled behavior when relevant.
10. Verify edge cases and error states.

### API do componente

Evite APIs that expose implementation details.

Prefira:

```tsx
<Input
  value={value}
  onChange={handleChange}
/>
```

over APIs that require consumers to understand internal state structures.

For complex components, keep related props grouped conceptually and use discriminated unions when different modes require different props.

---

# Testes

Os testes devem ficar próximos ao package que validam sempre que a estrutura do package permitir.

Utilize `packages/jest-config` for shared Jest configuration.

Ao modifying behavior:

- Update existing tests.
- Add regression tests for bugs.
- Test public behavior rather than implementation details.
- Evite testes que dependam desnecessariamente do estado interno do React.
- Test accessibility-related behavior when applicable.
- Test controlled and uncontrolled variants when applicable.

Para componentes de UI, o Storybook é complementar aos testes automatizados e não deve substituí-los.

---

# Storybook

O Storybook está localizado em:

```text
apps/docs
```

Stories should document the public API of components from `packages/ui`.

Uma boa story deve:

- Have a clear name.
- Demonstrate realistic usage.
- Expose meaningful controls where appropriate.
- Demonstrate important states.
- Evite reproducing the component's implementation.
- Be useful as visual documentation.

Ao corrigir um bug de UI, considere adicionar uma story ou interação que evite uma regressão.

---

# Estilização

O projeto utiliza Tailwind CSS e uma arquitetura de temas centralizada.

Prefira:

- Existing theme tokens
- Existing Tailwind configuration
- Existing component variants
- Shared styling conventions

Evite:

- Random hard-coded colors
- Duplicated design tokens
- Application-specific styles inside reusable components
- Inline styles when the project's existing styling architecture already supports the requirement

Se a visual value is part of the design system, consider whether it belongs in `packages/theme` instead of the component.

---

# Internacionalização

A UI reutilizável não deve conter textos de usuário hard-coded quando esses textos precisam ser traduzidos.

Utilize the project's `i18n` infrastructure.

Ao adicionar a new translatable string:

1. Identify the correct namespace.
2. Add the key to the locale resources.
3. Add the corresponding translations.
4. Verify the component through Storybook.
5. Add tests when translation behavior is part of the component contract.

Não introduce a second translation mechanism.

---

# Ícones

Utilize `packages/icons` como a abstração central de ícones.

Não espalhe imports diretos de `react-icons` pela aplicação e pelos packages de UI quando um ícone apropriado já estiver disponível através de `packages/icons`.

Se um novo ícone for necessário:

1. Add it to `packages/icons`.
2. Export it through the package's public API.
3. Consume it from `packages/ui` or applications through the centralized package.

---

# Migração de Código Compartilhado

`packages/utils` is being gradually migrated into `packages/shared`.

Ao encontrar código de utilitários existente:

```text
utils → shared
```

should generally be the direction for generic, framework-independent functionality.

Antes de migrar:

- Search for all consumers.
- Check package exports.
- Check tests.
- Check whether the current API is public.
- Consider backwards compatibility.
- Evite creating circular dependencies.

Não faça migrações amplas desnecessariamente como parte de uma feature não relacionada.

---

# Turborepo

Este é um monorepo Turborepo.

Ao alterar um package:

- Consider which packages and apps consume it.
- Respect package build order.
- Keep package scripts compatible with Turborepo.
- Evite unnecessary duplicated build steps.
- Prefira existing workspace scripts and conventions.

For changes to foundational packages such as:

- `shared`
- `ui`
- `theme`
- `i18n`
- `icons`
- configuration packages

expect downstream applications to potentially be affected.

---

# Exports dos Packages

As APIs públicas dos packages devem ser exportadas de forma intencional.

Prefira:

```text
package
└── src
    ├── components
    ├── hooks
    ├── providers
    └── index.ts
```

with explicit exports from the package entry point.

Evite exposing internal files solely because they happen to exist.

Ao adicionar a public feature:

1. Implement it.
2. Export it intentionally.
3. Add tests.
4. Update Storybook when applicable.
5. Verify the consuming application.

---

# Nomenclatura

Utilize uma nomenclatura consistente em todo o repositório.

### Components

Utilize PascalCase:

```text
Input
Dropdown
Breadcrumb
AlertProvider
```

### Hooks

Utilize the React convention:

```text
useAlert
useForm
useAppTranslation
```

### Utility functions

Utilize camelCase:

```text
applyMask
buildFormData
parseTranslationMessage
```

### Types

Utilize descriptive PascalCase names:

```text
InputProps
AlertState
ValueObjectConfig
```

Evite vague names such as:

```text
Data
Info
Thing
Helper
Utils
```

unless the context genuinely makes the meaning clear.

---

# Qualidade do Código

Antes de considerar uma alteração concluída:

- Run the relevant tests.
- Run linting when applicable.
- Run TypeScript checks when applicable.
- Build affected packages when necessary.
- Verify Storybook for UI changes.
- Verify `apps/finance` for changes that affect application integration.

Não ignore errors merely because they are outside the immediate file being changed. Shared packages can have downstream effects.

---

# Implementando Alterações

Ao implementar uma solicitação, siga esta ordem:

1. Understand the existing architecture.
2. Identify the correct package/application.
3. Search for existing implementations before creating new ones.
4. Reuse existing abstractions where possible.
5. Make the smallest architectural change that solves the problem.
6. Preserve public APIs unless the request explicitly requires a breaking change.
7. Add/update tests.
8. Add/update Storybook documentation for UI changes.
9. Validate affected packages.
10. Check for dependency-direction violations.

---

# Evite

Não:

- Put reusable components in `apps/finance`.
- Put application business logic in `packages/ui`.
- Make `theme`, `i18n`, or `icons` depend on `ui`.
- Introduce Next.js dependencies into generic packages without a strong reason.
- Create new utilities in `packages/utils` without considering `packages/shared`.
- Duplicate theme tokens.
- Duplicate translation mechanisms.
- Import icons from arbitrary sources when `packages/icons` already provides the abstraction.
- Circumvent package exports by importing internal files.
- Add dependencies merely to solve a problem that existing packages can already solve.
- Refactor unrelated parts of the repository while implementing a focused feature.

---

# Definition of Done

Uma alteração é considerada concluída quando:

- The implementation is located in the correct application/package.
- The dependency direction remains valid.
- Public APIs are intentionally exported.
- TypeScript types are correct.
- Tests are added or updated when behavior changes.
- Storybook is updated for UI changes.
- Translation resources are updated when needed.
- Icons use the centralized icon package.
- Shared functionality is placed in `shared` when appropriate.
- Relevant lint, typecheck, test, and build commands pass.
- No unnecessary application/package coupling was introduced.

---

# Princípio Orientador

Ao decidir onde um código deve ficar, pergunte:

> **Who should know about this?**

- If only `finance` knows about it → keep it in `apps/finance`.
- If it documents the design system → put it in `apps/docs`.
- If multiple applications/packages need generic TypeScript functionality → use `packages/shared`.
- If it is a legacy utility being migrated → consider `packages/utils`, but prefer `shared` for new generic functionality.
- If it defines visual behavior → consider `packages/theme`.
- If it handles translations → consider `packages/i18n`.
- If it centralizes icons → use `packages/icons`.
- If it is a reusable React UI component/hook/provider → use `packages/ui`.
- If it configures development tooling → use the appropriate configuration package.

The repository should evolve toward **clear boundaries, reusable abstractions, minimal coupling, strong typing, and a single source of truth for shared concerns**.
