# ORES Chat live HTML bundle consumer

External-consumer acceptance tests for the production component distribution published at:

```text
https://ores-chat.github.io/components/v1/
```

The suite downloads the live JavaScript bundle, checksum, manifest, and provenance document from the public origin. It verifies SHA-256 integrity, source ownership, declared surfaces, bounded request behavior, credential omission, and the absence of React/JSX/TSX dependencies.

Run `npm test`. Set `ORES_CHAT_COMPONENT_BASE` only to test another reviewed HTTPS distribution origin.
