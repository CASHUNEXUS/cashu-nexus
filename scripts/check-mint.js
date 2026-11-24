import { connectMint } from "../src/cashu/mint-client.js";

const mintUrl = process.env.MINT_URL || "https://testnut.cashu.space";

try {
  console.log("Connecting to Cashu test mint...");
  console.log("Mint URL:", mintUrl);

  const { wallet, mintInfoCache, unit } = await connectMint(mintUrl);

  console.log("\nMint connection successful.");
  console.log("Name:", mintInfoCache.name);
  console.log("Version:", mintInfoCache.version);
  console.log("Unit:", unit);
  console.log("Loaded keyset:", wallet.keysetId);
  console.log("Mint info and keysets were loaded successfully.");
  console.log("\nNo invoices, payments, ecash tokens, or real funds were used.");
} catch (error) {
  console.error("\nMint connection failed:");
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
