# Contributing

Thanks for helping make Bangla right in software.

1. Fork and clone, then `pnpm install` (Node 20 or newer, pnpm 9).
2. Write the test first in `packages/core/test`. Every word change needs a source (Bangla Academy dictionary or a published style guide).
3. `pnpm lint && pnpm typecheck && pnpm test && pnpm build` must pass. Keep coverage at 90% or above.
4. Run `pnpm changeset` and describe the change.
5. Open a pull request. Keep the core free of runtime dependencies.

Changes to `WORDS_0_99` must update `packages/core/test/fixtures/words-0-99.json` and be confirmed by a second native speaker in the PR.
