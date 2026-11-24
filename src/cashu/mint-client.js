/**
 * Cashu Nexus — v1.0 wallet foundation
 *
 * This module is deliberately limited to connecting to a mint and loading
 * its public metadata. It does not create, import, store, send or redeem
 * proofs, and it must not be treated as a production wallet.
 */
import { Wallet } from "@cashu/cashu-ts";

const DEFAULT_UNIT = "sat";

export function validateMintUrl(input) {
  let url;
  try {
    url = new URL(String(input).trim());
  } catch {
    throw new Error("Enter a valid mint URL.");
  }

  const isLocalHost = ["localhost", "127.0.0.1", "::1", "[::1]"].includes(url.hostname);
  if (url.protocol !== "https:" && !(isLocalHost && url.protocol === "http:")) {
    throw new Error("For safety, mint connections must use HTTPS (HTTP is allowed only for localhost testing).");
  }
  if (url.username || url.password) {
    throw new Error("Mint URLs must not contain embedded credentials.");
  }
  return url.toString().replace(/\/$/, "");
}

/**
 * Connect to a mint and load its public info/keyset metadata.
 * Never pass a real wallet seed or real ecash token to this module.
 */
export async function connectMint(input, { unit = DEFAULT_UNIT } = {}) {
  const mintUrl = validateMintUrl(input);
  if (unit !== "sat") {
    throw new Error("This initial adapter currently supports sat units only.");
  }

  const wallet = new Wallet(mintUrl);
  await wallet.loadMint();

  const mintInfoCache = wallet.getMintInfo().cache;
  return {
    mintUrl,
    unit,
    mintInfoCache,
    wallet
  };
}
