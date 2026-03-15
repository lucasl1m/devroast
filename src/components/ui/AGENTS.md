# Padrões de Componentes UI

Este documento define os padrões para criação de componentes UI genéricos no projeto.

## Estrutura de Arquivos

```
src/components/ui/
├── index.ts          # Barrel export de todos os componentes
├── button.tsx        # Componente individual
├── agents.md         # Este arquivo
```

## Regras de Ouro

| Regra | ✅ Correto | ❌ Errado |
|-------|-----------|-----------|
| **Export** | Named exports | `export default` |
| **Function** | `function Component()` | Arrow function `const Component = () =>` |
| **Cores** | Variáveis do theme (`bg-accent-green`) | Cores hardcoded (`bg-emerald-500`) |
| **Fontes** | `font-mono` | `font-[family]` |

## Padrões TypeScript

### Tipos

Sempre criar tipos separados e exportá-los:

```tsx
type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

export type { ButtonVariant, ButtonSize };
```

### Componentes

Usar function declaration (não arrow function nem forwardRef):

```tsx
function Button({
  className,
  variant = "primary",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
```

### Exports

Nunca usar default export. Usar named exports:

```tsx
// ✅ Correto
export { Button, buttonVariants };
export type { ButtonProps, ButtonVariant, ButtonSize };

// ❌ Errado
export default Button;
```

## Biblioteca de Estilos

### Tailwind Variants (tv)

Usar `tailwind-variants` para criar variantes:

```tsx
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base: "classes-base-para-todos",
  variants: {
    variant: {
      primary: "classes-primary",
      secondary: "classes-secondary",
    },
    size: {
      default: "classes-size-padrao",
      sm: "classes-small",
      lg: "classes-large",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
  },
});
```

### Tailwind Merge

Usar `twMerge` para mesclar classes:

```tsx
import { twMerge } from "tailwind-merge";

className={twMerge(buttonVariants({ variant, size, className }))}
```

### CSS Variables (Tailwind v4)

O projeto usa variáveis CSS definidas em `src/app/globals.css`. Use a sintaxe de variável do Tailwind:

```tsx
// ✅ Correto - usar variáveis do theme
"bg-accent-green"
"text-text-primary"
"border-border-primary"

// ❌ Errado - cores hardcoded
"bg-emerald-500"
"text-[#FAFAFA]"
"border-[#2A2A2A]"
```

### Fontes

O projeto usa fontes configuradas via `next/font/google`:

```tsx
// ✅ Correto - usar classes de fonte do Tailwind
"font-mono"      // JetBrains Mono
"font-code"      // IBM Plex Mono

// ❌ Errado - especificar família manualmente
"font-[family='JetBrains_Mono']"
```

## Propriedades Native

Sempre estender propriedades nativas do HTML:

```tsx
import { type ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // propriedades específicas do componente
}
```

## Nomenclatura

- **Arquivo**: `kebab-case` (ex: `button.tsx`, `input-field.tsx`)
- **Componente**: PascalCase (ex: `Button`, `InputField`)
- **Variantes**: camelCase (ex: `primary`, `secondary`, `ghost`)
- **Tamanhos**: camelCase (ex: `default`, `sm`, `lg`, `icon`)

## Barrel Export (index.ts)

Exportar tudo de um lugar só:

```tsx
export {
  Button,
  buttonVariants,
  type ButtonProps,
  type ButtonVariant,
  type ButtonSize,
} from "./button";
```

## Checklist de Revisão

Antes de commit, verifique:

- [ ] Não há `export default`
- [ ] Componente usa `function` (não arrow)
- [ ] Não há cores hardcoded (`#hex`, `emerald-500`, etc.)
- [ ] Usa variáveis do theme (`bg-accent-green`, `text-text-primary`)
- [ ] Usa `font-mono` ou `font-code` (não famílias específicas)
- [ ] Tipos estão separados e exportados
- [ ] Propriedades nativas estendidas corretamente

## Referência de Variáveis

### Cores (disponíveis no theme)

| Variável | Uso no Tailwind | Exemplo |
|----------|----------------|---------|
| `--accent-green` | `bg-accent-green` | Botão primary |
| `--accent-red` | `text-accent-red` | Error/Badge critical |
| `--accent-amber` | `text-accent-amber` | Warning |
| `--bg-page` | `bg-bg-page` | Background principal |
| `--bg-input` | `bg-bg-input` | Input/CodeBlock |
| `--bg-surface` | `bg-bg-surface` | Cards |
| `--bg-elevated` | `bg-bg-elevated` | Modals |
| `--text-primary` | `text-text-primary` | Texto principal |
| `--text-secondary` | `text-text-secondary` | Texto secundário |
| `--text-tertiary` | `text-text-tertiary` | Texto muted |
| `--border-primary` | `border-border-primary` | Bordas |
| `--border-secondary` | `border-border-secondary` | Bordas alternativas |

### Fontes

| Variável | Tailwind | Fonte |
|----------|----------|-------|
| `--font-mono` | `font-mono` | JetBrains Mono |
| `--font-code` | `font-code` | IBM Plex Mono |

## Exemplo Completo

```tsx
// button.tsx
import { type ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base: "inline-flex items-center justify-center gap-2...",
  variants: {
    variant: {
      primary: "bg-accent-green text-neutral-900...",
      secondary: "bg-transparent border border-border-primary...",
    },
    size: {
      default: "px-6 py-2.5...",
      sm: "px-4 py-2...",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
  },
});

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export type { ButtonVariant, ButtonSize };

function Button({
  className,
  variant = "primary",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
```
