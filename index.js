import * as Web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";
import bs58 from "bs58";
import dotenv from "dotenv";
dotenv.config();

const ACCOUNT_1 = Web3.Keypair.fromSecretKey(
  bs58.decode(process.env.PRIVATE_KEY_1)
);

// FIX: bigint: Failed to load bindings, pure JS will be used (try npm run rebuild?)
async function main() {
  const connection = new Web3.Connection(
    Web3.clusterApiUrl("devnet"),
    "confirmed"
  );

  const mint = await token.createMint(
    connection,
    ACCOUNT_1,
    ACCOUNT_1.publicKey,
    ACCOUNT_1.publicKey,
    9
  );

  console.log("mint", mint.toString());

  const tokenAccount = await token.getOrCreateAssociatedTokenAccount(
    connection,
    ACCOUNT_1,
    mint,
    ACCOUNT_1.publicKey
  );

  console.log("tokenAccount", tokenAccount.address.toString());

  await token.mintTo(
    connection,
    ACCOUNT_1,
    mint,
    tokenAccount.address,
    ACCOUNT_1,
    100
  );

  const mintInfo = await token.getMint(connection, mint);

  const tokenAccountInfo = await token.getAccount(
    connection,
    tokenAccount.address
  );

  console.log("mintInfo-supply", mintInfo.supply);
  console.log("tokenAccountInfo-amount", tokenAccountInfo.amount);
}

main();
