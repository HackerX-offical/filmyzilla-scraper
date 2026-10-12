# filmyzilla-scraper — architecture

## Purpose

CLI scraper: fetches HTML, parses listings, writes JSON. Non-goals: bypassing paywalls
or distributing copyrighted media.

## High-level flow

```mermaid
flowchart LR
  CLI[CLI] --> Core[Core engine]
  Core --> Modules[Domain modules]
  Modules --> Reporters[Reporters]
```

## Module map

| Path             | Responsibility              |
| ---------------- | --------------------------- |
| `src/index.ts`   | CLI entry                   |
| `src/scraper.ts` | Category and movie pipeline |
| `src/url.ts`     | URL/year helpers (tested)   |

## Extension

1. Add a module under the appropriate `src/` folder.
2. Register it in the orchestrator (if applicable).
3. Add unit tests with mocks — no live network in unit tests.
4. Run `npm test` and `npm run format:check`.

## Testing strategy

- **Unit**: mocked I/O, pure parsers, reporters.
- **Integration** (if present): live targets documented in README; optional in CI or
  scheduled.

## Ethics & scope

Authorized engagements only. See [SECURITY.md](./SECURITY.md).
