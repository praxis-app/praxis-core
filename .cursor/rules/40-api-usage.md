---
name: API Client Usage
description: Rules for api-client.ts usage patterns
match:
  - "view/**/*.{ts,tsx}"
---

- Use the `api` client for all network requests; avoid inlining `axios`.
- Respect existing method signatures; extend `api-client.ts` when adding endpoints.
- Keep query keys accurate and scoped (e.g., ['messages', channelId], ['feed', channelId]).
- Update react-query caches using the correct query type (`MessagesQuery` vs `FeedQuery`) and structures.
- On mutations, optimistically update caches only when safe; otherwise, invalidate.
