import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";

const configuredBase = process.env.ORES_CHAT_COMPONENT_BASE
  ?? "https://ores-chat.github.io/components/v1/";
const base = new URL(configuredBase);

assert.equal(base.protocol, "https:", "live component base must use HTTPS");
if (!base.pathname.endsWith("/")) base.pathname += "/";

async function fetchText(path) {
  const response = await fetch(new URL(path, base), {
    redirect: "error",
    signal: AbortSignal.timeout(20_000),
  });
  assert.equal(response.status, 200, `${path} must be publicly available`);
  return response.text();
}

test("published bundle matches checksum, manifest, and provenance", async () => {
  const [artifact, checksumFile, manifestText, provenanceText] = await Promise.all([
    fetchText("ores-chat-footer-link.js"),
    fetchText("ores-chat-footer-link.js.sha256"),
    fetchText("manifest.json"),
    fetchText("provenance.json"),
  ]);

  const digest = createHash("sha256").update(artifact).digest("hex");
  const checksum = checksumFile.trim().split(/\s+/)[0];
  const manifest = JSON.parse(manifestText);
  const provenance = JSON.parse(provenanceText);

  assert.equal(digest, checksum);
  assert.equal(manifest.schema_version, 1);
  assert.equal(manifest.package, "@ores-chat/external-components");
  assert.equal(manifest.artifacts[0].sha256, digest);
  assert.deepEqual(manifest.artifacts[0].surfaces, ["html", "custom-element"]);
  assert.equal(provenance.sha256, digest);
  assert.equal(provenance.source_repository, "https://github.com/ores-chat/ores-chat-external-components");
});

test("live bundle exposes the bounded public custom-element contract", async () => {
  const artifact = await fetchText("ores-chat-footer-link.js");
  assert.match(artifact, /customElements\.define\("ores-chat-footer-link"/);
  assert.match(artifact, /v1\/public\/messages/);
  assert.match(artifact, /credentials:\s*"omit"/);
  assert.match(artifact, /context_id:\s*contextId/);
  assert.match(artifact, /MAX_MESSAGE_LENGTH\s*=\s*4_000/);
  assert.match(artifact, /REQUEST_TIMEOUT_MS\s*=\s*20_000/);
  assert.doesNotMatch(artifact, /from\s+["']react|react-dom|\.tsx|\.jsx/i);
});
