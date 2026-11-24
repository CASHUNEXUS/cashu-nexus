import test from "node:test";
import assert from "node:assert/strict";
import { inspectToken } from "../src/cashu/token-inspector.js";

const walletWith = (decoded) => ({ decodeToken: () => decoded });

test("returns display-safe metadata without proof secrets", () => {
  const result = inspectToken(walletWith({
    mint: "https://mint.example/", unit: "sat",
    proofs: [{ amount: 8, secret: "DO_NOT_RETURN" }, { amount: 4, secret: "ALSO_SECRET" }]
  }), "cashuAexample");
  assert.deepEqual(result, {
    mint: "https://mint.example", unit: "sat", amount: 12, proofCount: 2,
    proofMaterialExposed: false, receiveEnabled: false
  });
  assert.equal(JSON.stringify(result).includes("DO_NOT_RETURN"), false);
});

test("rejects empty token", () => assert.throws(
  () => inspectToken(walletWith({}), "  "), /Paste a Cashu token/
));
test("rejects non-sat token", () => assert.throws(() => inspectToken(walletWith({
  mint: "https://mint.example", unit: "usd", proofs: [{ amount: 1 }]
}), "token"), /sat tokens only/));
test("rejects empty proofs", () => assert.throws(() => inspectToken(walletWith({
  mint: "https://mint.example", proofs: []
}), "token"), /no proofs/));
test("rejects invalid proof amount", () => assert.throws(() => inspectToken(walletWith({
  mint: "https://mint.example", proofs: [{ amount: -1 }]
}), "token"), /invalid proof amount/));
test("rejects remote HTTP mint", () => assert.throws(() => inspectToken(walletWith({
  mint: "http://mint.example", proofs: [{ amount: 1 }]
}), "token"), /HTTPS/));
test("requires a wallet decoder", () => assert.throws(
  () => inspectToken({}, "token"), /loaded Cashu wallet/
));
