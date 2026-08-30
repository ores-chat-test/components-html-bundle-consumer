# ORES Chat HTML consumer instructions

- This public `ores-chat-test` repository verifies the live, reviewed production HTML bundle as an external consumer.
- Fetch only the HTTPS distribution origin declared by `ORES_CHAT_COMPONENT_BASE`, defaulting to `https://ores-chat.github.io/components/v1/`.
- Verify the published SHA-256 checksum and manifest before inspecting the JavaScript contract.
- Never store provider tokens, service credentials, cookies, private endpoints, customer data, or production request bodies.
- Do not add React, React DOM, JSX, TSX, Next.js, or React-compatible adapters.
- Keep tests deterministic and fail closed on HTTP, integrity, manifest, or public API contract errors.
- Use feature branches and pull requests. Never rebase, force-push, stash, or reset shared work.
