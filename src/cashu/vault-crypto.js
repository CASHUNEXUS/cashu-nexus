/**
 * Cashu Nexus — encrypted vault envelope primitive.
 *
 * This module encrypts/decrypts JSON vault snapshots in memory. It does NOT
 * persist data, manage passwords, protect a compromised device, or implement
 * proof lifecycle/atomicity. Do not treat it as a production wallet vault.
 */
const FORMAT = "cashu-nexus-vault";
const VERSION = 1;
const ITERATIONS = 310000;
const MAX_PLAINTEXT_BYTES = 1024 * 1024;

function getCrypto(provider) {
  const api = provider ?? globalThis.crypto;
  if (!api?.subtle || typeof api.getRandomValues !== "function") {
    throw new Error("A Web Crypto implementation is required.");
  }
  return api;
}

function encodeBase64(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function decodeBase64(value) {
  if (typeof value !== "string" || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)) {
    throw new Error("Invalid encrypted vault encoding.");
  }
  const binary = atob(value);
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}

function validatePassphrase(passphrase) {
  if (typeof passphrase !== "string" || passphrase.length < 12) {
    throw new Error("Vault passphrase must contain at least 12 characters.");
  }
}

async function deriveKey(passphrase, salt, cryptoApi) {
  const material = await cryptoApi.subtle.importKey(
    "raw", new TextEncoder().encode(passphrase), "PBKDF2", false, ["deriveKey"]
  );
  return cryptoApi.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: ITERATIONS },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptVaultSnapshot(snapshot, passphrase, { cryptoProvider } = {}) {
  validatePassphrase(passphrase);
  const cryptoApi = getCrypto(cryptoProvider);
  let plaintext;
  try {
    plaintext = new TextEncoder().encode(JSON.stringify(snapshot));
  } catch {
    throw new Error("Vault snapshot must be JSON-serializable.");
  }
  if (plaintext.byteLength === 0 || plaintext.byteLength > MAX_PLAINTEXT_BYTES) {
    throw new Error("Vault snapshot must be between 1 byte and 1 MiB.");
  }

  const salt = cryptoApi.getRandomValues(new Uint8Array(16));
  const iv = cryptoApi.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt, cryptoApi);
  const ciphertext = await cryptoApi.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);

  return Object.freeze({
    format: FORMAT,
    version: VERSION,
    kdf: "PBKDF2-SHA256",
    iterations: ITERATIONS,
    cipher: "AES-256-GCM",
    salt: encodeBase64(salt),
    iv: encodeBase64(iv),
    ciphertext: encodeBase64(new Uint8Array(ciphertext))
  });
}

export async function decryptVaultSnapshot(envelope, passphrase, { cryptoProvider } = {}) {
  validatePassphrase(passphrase);
  const cryptoApi = getCrypto(cryptoProvider);
  if (!envelope || envelope.format !== FORMAT || envelope.version !== VERSION ||
      envelope.kdf !== "PBKDF2-SHA256" || envelope.iterations !== ITERATIONS ||
      envelope.cipher !== "AES-256-GCM") {
    throw new Error("Unsupported or invalid encrypted vault format.");
  }

  const salt = decodeBase64(envelope.salt);
  const iv = decodeBase64(envelope.iv);
  const ciphertext = decodeBase64(envelope.ciphertext);
  if (salt.length !== 16 || iv.length !== 12 || ciphertext.length < 17 ||
      ciphertext.length > MAX_PLAINTEXT_BYTES + 16) {
    throw new Error("Encrypted vault envelope has invalid dimensions.");
  }

  const key = await deriveKey(passphrase, salt, cryptoApi);
  let plaintext;
  try {
    plaintext = await cryptoApi.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
  } catch {
    throw new Error("Unable to unlock vault: wrong passphrase or damaged data.");
  }
  if (plaintext.byteLength > MAX_PLAINTEXT_BYTES) {
    throw new Error("Decrypted vault exceeds the supported size.");
  }
  try {
    return JSON.parse(new TextDecoder().decode(plaintext));
  } catch {
    throw new Error("Decrypted vault content is not valid JSON.");
  }
}
