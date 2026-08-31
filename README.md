# ORES Chat live HTML bundle consumer

External-consumer acceptance tests for the production component distribution published at:

```text
https://ores-chat.github.io/components/v1/
```

The suite downloads the live JavaScript bundle, checksum, manifest, and provenance document from the public origin. It verifies SHA-256 integrity, immutable source PR/commit ownership, declared surfaces, the authoritative `/v1/public/chat` request/response contract, request correlation, bounded request behavior, credential omission, and the absence of React/JSX/TSX dependencies. The live module is imported and exercised as an external consumer rather than trusted through source inspection alone.

Run `npm test`. Set `ORES_CHAT_COMPONENT_BASE` only to test another reviewed HTTPS distribution origin.
