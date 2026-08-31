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
  assert.equal(provenance.source_commit, "27ce4d4b63482c3d2c6e15eb298c3b7f53780278");
  assert.equal(
    provenance.source_pull_request,
    "https://github.com/ores-chat/ores-chat-external-components/pull/2",
  );
});

test("live bundle exposes the bounded public custom-element contract", async () => {
  const artifact = await fetchText("ores-chat-footer-link.js");
  assert.match(artifact, /customElements\.define\("ores-chat-footer-link"/);
  assert.match(artifact, /v1\/public\/chat/);
  assert.match(artifact, /credentials:\s*"omit"/);
  assert.match(artifact, /"x-ores-chat-site": contextId/);
  assert.match(artifact, /"x-request-id": requestId/);
  assert.match(artifact, /MAX_MESSAGE_LENGTH\s*=\s*4_000/);
  assert.match(artifact, /REQUEST_TIMEOUT_MS\s*=\s*20_000/);
  assert.doesNotMatch(artifact, /v1\/public\/messages/);
  assert.doesNotMatch(artifact, /from\s+["']react|react-dom|\.tsx|\.jsx/i);

  const live = await import(`data:text/javascript;base64,${Buffer.from(artifact).toString("base64")}`);
  assert.equal(
    live.buildMessageEndpoint("https://chat.example.test/api/"),
    "https://chat.example.test/api/v1/public/chat",
  );
  const request = live.buildPublicChatRequest({
    requestId: "request_01",
    contextId: "ores-chat-marketing",
    message: " How does this work? ",
  });
  assert.deepEqual(request, {
    protocol: "ores.chat/v1",
    request_id: "request_01",
    message: "How does this work?",
    context_refs: [{ id: "ores-chat-marketing" }],
  });
  for (const forbidden of ["authorization", "token", "provider", "audience"]) {
    assert.equal(JSON.stringify(request).includes(forbidden), false);
  }
  assert.equal(
    live.extractAssistantReply(
      { protocol: "ores.chat/v1", request_id: "request_01", answer: " Verified live " },
      "request_01",
    ),
    "Verified live",
  );
  assert.throws(
    () => live.extractAssistantReply(
      { protocol: "ores.chat/v1", request_id: "request_other", answer: "Wrong request" },
      "request_01",
    ),
    TypeError,
  );
});
