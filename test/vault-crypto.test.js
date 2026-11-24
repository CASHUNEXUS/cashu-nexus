import test from "node:test";
import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import { encryptVaultSnapshot, decryptVaultSnapshot } from "../src/cashu/vault-crypto.js";

const cryptoProvider = webcrypto;
const passphrase = "correct horse battery staple";

test("encrypts and decrypts a JSON snapshot without exposing plaintext", async () => {
  const snapshot = { version: 1, records: [{ id: "demo", amount: 42 }] };
  const envelope = await encryptVaultSnapshot(snapshot, passphrase, { cryptoProvider });
  assert.equal(envelope.cipher, "AES-256-GCM");
  assert.equal(JSON.stringify(envelope).includes('"amount":42'), false);
  assert.deepEqual(await decryptVaultSnapshot(envelope, passphrase, { cryptoProvider }), snapshot);
});

test("uses a fresh salt and IV for each encryption", async () => {
  const a = await encryptVaultSnapshot({ ok: true }, passphrase, { cryptoProvider });
  const b = await encryptVaultSnapshot({ ok: true }, passphrase, { cryptoProvider });
  assert.notEqual(a.salt, b.salt);
  assert.notEqual(a.iv, b.iv);
});

test("rejects short passphrases and wrong passphrases", async () => {
  await assert.rejects(() => encryptVaultSnapshot({}, "short", { cryptoProvider }), /at least 12/);
  const envelope = await encryptVaultSnapshot({ safe: true }, passphrase, { cryptoProvider });
  await assert.rejects(
    () => decryptVaultSnapshot(envelope, "wrong passphrase value", { cryptoProvider }),
    /wrong passphrase or damaged data/
  );
});

test("rejects altered ciphertext and unsupported envelopes", async () => {
  const envelope = await encryptVaultSnapshot({ safe: true }, passphrase, { cryptoProvider });
  const altered = { ...envelope, ciphertext: envelope.ciphertext.slice(0, -4) + "AAAA" };
  await assert.rejects(() => decryptVaultSnapshot(altered, passphrase, { cryptoProvider }));
  await assert.rejects(() => decryptVaultSnapshot({ ...envelope, version: 99 }, passphrase, { cryptoProvider }), /Unsupported/);
});
