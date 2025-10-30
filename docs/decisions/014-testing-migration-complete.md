# 014 – TypeScript Test Migration Complete (WEB-44)

Date: 2025-10-30
Status: Accepted
Authors: @developer

## Context
We migrated the JavaScript test suite to a TypeScript-based test suite using Vitest and `convex-test`. Goals were to improve speed, maintainability, and type safety ahead of the beta launch.

## Decision
- Adopt Vitest + `convex-test` as the default unit test stack
- Mock Better Auth in tests by deriving identity from `t.withIdentity()`
- Handle scheduled functions with `vi.useFakeTimers()` and `t.finishAllScheduledFunctions()`
- Provide modules to `convexTest` via `import.meta.glob` (with `@ts-expect-error`)
- Exclude non-runtime/config modules from coverage to focus on meaningful code paths

## Consequences
- Coverage at acceptance: ~88% statements/lines (`pnpm test:coverage`)
- Faster CI and local tests (in-memory vs network)
- Clear patterns for authenticated tests and scheduled functions
- Reduced deployment noise via `.convexignore` (excludes tests, scripts, coverage)

## Alternatives Considered
- Keep legacy JavaScript runner: slower, no type safety
- Custom mocks for auth: higher maintenance than deriving from `t.withIdentity()`

## Follow-ups
- Add integration tests for auth-init, signup-flow, and phase2-features
- Maintain ≥85–90% coverage as features land
