# Code Editor Specification

## Overview

Editor de código para a homepage do DevRoast onde usuários colam código e recebem feedback.

## Requirements

1. **Paste/Input** - Área para usuário colar código (não editável, apenas paste)
2. **Syntax Highlighting** - Colorização automática baseada na linguagem
3. **Auto-detect Language** - Detectar linguagem automaticamente
4. **Manual Language Selection** - Dropdown para selecionar manualmente (especialmente quando auto-detect falha)

---

## Research: Ray.so Analysis

### How ray.so works

- **Syntax Highlighting**: Shiki (`shiki` ^1.0.0)
- **Language Selection**: Manual dropdown (LanguageControl.tsx)
- **Rendering**: `dangerouslySetInnerHTML` com output HTML do Shiki
- **State Management**: Jotai atoms
- **Themes**: Suporta múltiplos temas (tailwind-dark, tailwind-light, css-variables)

### Key Insight

Ray.so usa Shiki apenas para **renderizar** código destacado (read-only), não como editor editável. O input de código é feito via textarea simples.

---

## Options Analysis

### Option A: Shiki (Recommended)

| Pros | Cons |
|------|------|
| Já está no projeto | Não é editável (precisa combinar com textarea) |
| SSR support | Requer textarea separado para input |
| Excelente qualidade de highlight | |
| Multiple themes | |

**Approach**: Textarea para input + Shiki para renderizar código destacado sobreposta (overlay approach como ray.so)

### Option B: Monaco Editor

| Pros | Cons |
|------|------|
| Editável nativamente | Muito pesado (~2MB) |
| Syntax highlighting built-in | Overkill para nosso caso |
| IntelliSense | Configuração complexa |

### Option C: CodeMirror 6

| Pros | Cons |
|------|------|
| Moderno, modular | Mais complexo que necessário |
| Levente que Monaco | |
| Editável | |

### Option D: highlight.js

| Pros | Cons |
|------|------|
| Auto-detect built-in | Menor qualidade que Shiki |
| leve | Output menos controlável |

---

## Language Detection

### Option 1: highlight.js highlightAuto

```js
const result = hljs.highlightAuto(code);
console.log(result.language); // 'javascript', 'python', etc.
```

### Option 2: Simple Heuristics

- Detectar por padrões (ex: `function` → JavaScript, `def` → Python)
- Mais leve, sem dependência extra

### Option 3: User Manual Override

- Sempre permitir usuário selecionar manualmente
- Auto-detect como fallback inicial

---

## Final Recommendation

### Choice: Monaco Editor ✅

| Pros | Cons |
|------|------|
| Editável nativamente | Pesado (~2MB) |
| Syntax highlighting built-in | Configuração mais complexa |
| IntelliSense integrado | |
| Auto-detect via `monaco.editor.guessLanguage` | |
| Excelente suporte a muitas linguagens | |

---

## Implementation Plan

- [x] Decidir abordagem: Monaco Editor ✅
- [x] Instalar `@monaco-editor/react` ✅
- [x] Criar `CodeEditor` component em `src/components/ui/code-editor.tsx` ✅
- [ ] Configurar tema escuro (dark theme) - usando vs-dark
- [x] Adicionar auto-detect com heuristics customizado ✅
- [x] Adicionar dropdown para manual override ✅
- [x] Exportar em `src/components/ui/index.ts` ✅

### Dependencies

- `@monaco-editor/react` ✅

---

## Answers

1. **Editável**: Sim
2. **Linguagens**: Boa parte (múltiplas)
3. **Auto-detect**: Sim, com fallback manual se falhar
