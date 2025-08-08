---
name: Frontend (Vite + React)
description: Rules for client code in /view
match:
  - "view/**/*.{ts,tsx}"
---

- Use react-query for data fetching; keep query keys consistent (e.g., ['feed', channelId]).
- Use zod + @hookform/resolvers for forms; keep schemas near the form.
- All strings go through `useTranslation()` with keys under the appropriate namespace.
- Prefer small presentational components; keep side effects in hooks.
- When rendering lists, use stable keys of the form `message-<id>` and `proposal-<id>`.
- For images:
  - Lazy-load via `LazyLoadImage` and `useImageSrc`.
  - Missing/404 images must render a graceful placeholder text using i18n.
- Avoid inline styles. Use utility classes and shared UI components (Button, Card, Select, etc.).
