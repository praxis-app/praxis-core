---
name: Repository Conventions
description: Core guidelines that apply to all code in this repo
match:
  - "**/*"
---

- Prefer TypeScript with explicit function signatures for exported APIs; avoid `any`.
- Follow clear naming (no 1–2 letter names). Functions are verbs; variables are concrete nouns.
- Use guard clauses and early returns. Avoid deep nesting.
- Handle errors explicitly; surface user-facing errors via i18n on the client.
- Keep code readable and high-verbosity; avoid clever one-liners.
- Do not leave TODOs for essential logic; implement where feasible.
- Keep unrelated formatting changes out of edits.
- For UI strings, always use react-i18next; do not hardcode user-visible text.
- Keep file/module responsibilities narrow and cohesive.
- Prefer composing existing utilities/components over introducing new dependencies.
