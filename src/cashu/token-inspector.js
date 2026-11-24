/**
 * Cashu Nexus — non-spending token inspection.
 * This module only decodes locally. It does not contact a mint, receive/swap
 * proofs, persist funds, or make a token safe to store.
 */
import { validateMintUrl } from "./mint-client.js";

export function inspectToken(wallet, token) {
  if (!wallet || typeof wallet.decodeToken !== "function") {
    throw new Error("A loaded Cashu wallet is required.");
  }
  if (typeof token !== "string" || token.trim().length === 0) {
    throw new Error("Paste a Cashu token to inspect.");
  }

  const decoded = wallet.decodeToken(token.trim());
  if (!decoded || typeof decoded !== "object") {
    throw new Error("The token could not be decoded.");
  }

  const mint = validateMintUrl(decoded.mint);
  const unit = decoded.unit ?? "sat";
  if (unit !== "sat") throw new Error("This alpha build supports sat tokens only.");

  const proofs = decoded.proofs;
  if (!Array.isArray(proofs) || proofs.length === 0) {
    throw new Error("The token contains no proofs.");
  }

  const amount = proofs.reduce((sum, proof) => {
    const value = Number(proof?.amount);
    if (!Number.isSafeInteger(value) || value <= 0) {
      throw new Error("The token contains an invalid proof amount.");
    }
    return sum + value;
  }, 0);

  if (!Number.isSafeInteger(amount)) {
    throw new Error("The token amount is outside the supported safe range.");
  }

  return Object.freeze({
    mint, unit, amount, proofCount: proofs.length,
    proofMaterialExposed: false, receiveEnabled: false
  });
}
