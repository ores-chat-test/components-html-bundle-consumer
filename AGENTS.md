# ORES Chat HTML consumer instructions

- This public `ores-chat-test` repository verifies the live, reviewed production HTML bundle as an external consumer.
- Fetch only the HTTPS distribution origin declared by `ORES_CHAT_COMPONENT_BASE`, defaulting to `https://ores-chat.github.io/components/v1/`.
- Verify the published SHA-256 checksum and manifest before inspecting the JavaScript contract.
- Never store provider tokens, service credentials, cookies, private endpoints, customer data, or production request bodies.
- Do not add React, React DOM, JSX, TSX, Next.js, or React-compatible adapters.
- Keep tests deterministic and fail closed on HTTP, integrity, manifest, or public API contract errors.
- Use feature branches and pull requests. Never rebase, force-push, stash, or reset shared work.

## Repository-local Git worktrees

- Create or use a Git worktree only when the human operator explicitly authorizes it for the current task. Concurrency or a dirty checkout is not permission by itself.
- Put every authorized worktree at `<repository-root>/tmp/worktrees/<name>`; from the repository root, use `./tmp/worktrees/<name>`. Never place worktrees beside repositories or organization directories.
- Keep `tmp`, `temp`, `tmp/worktrees`, and `temp/worktrees` ignored in the repository-root `.gitignore`. Do not commit files from those directories.
- Relocate or remove a worktree only when the operator explicitly requests it. Before removal, preserve and publish intended changes, verify its commit is represented on the target branch, and confirm there are no tracked, untracked, ignored-sensitive, or in-use files that must survive. Remove it with `git worktree remove <path>` without `--force`; never delete a worktree directory with `rm`.
