import test from "node:test";
import assert from "node:assert/strict";
import { validateMintUrl, connectMint } from "../src/cashu/mint-client.js";

test("accepts HTTPS mint URLs and normalizes a trailing slash", () => {
  assert.equal(validateMintUrl("  https://mint.example/  "), "https://mint.example");
});

test("allows HTTP only for local development", () => {
  assert.equal(validateMintUrl("http://localhost:3338/"), "http://localhost:3338");
  assert.equal(validateMintUrl("http://127.0.0.1:3338/"), "http://127.0.0.1:3338");
  assert.equal(validateMintUrl("http://[::1]:3338/"), "http://[::1]:3338");
});

test("rejects remote HTTP URLs", () => {
  assert.throws(() => validateMintUrl("http://mint.example"), /HTTPS/);
});

test("rejects malformed URLs", () => {
  assert.throws(() => validateMintUrl("not a URL"), /valid mint URL/);
});

test("rejects embedded credentials", () => {
  assert.throws(() => validateMintUrl("https://user:secret@mint.example"), /credentials/);
});

test("rejects unsupported units before any network connection", async () => {
  await assert.rejects(
    connectMint("https://mint.example", { unit: "usd" }),
    /sat units only/
  );
});
