const { Connection, PublicKey } = require("@solana/web3.js");

const RPC_URL = "https://api.mainnet-beta.solana.com";
const connection = new Connection(RPC_URL);

const POOL_ADDRESS = new PublicKey("PUT_YOUR_POOL_ADDRESS_HERE");
const TOKEN_A_MINT = new PublicKey("PUT_TOKEN_A_MINT_ADDRESS_HERE");
const TOKEN_B_MINT = new PublicKey("PUT_TOKEN_B_MINT_ADDRESS_HERE");
const SWAP_PROGRAM_ID = new PublicKey("9Ww9vTFpEtGRbUgJcNoEFfZDVLkfuU7pTVt7nGz5dsjZ");
module.exports = {
  connection,
  POOL_ADDRESS,
  TOKEN_A_MINT,
  TOKEN_B_MINT,
  SWAP_PROGRAM_ID,
};
