# Orca Pool Analytics

This project tracks the volume and total value locked (TVL) of a single Orca
liquidity pool on Solana. It queries a Solana RPC endpoint to fetch
transactions and token balances.

## Setup

1. **Install Node.js** – version 16 or later is recommended.
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure environment variables** – create a `.env` file in the project
   root or export the variables in your shell. At minimum the following values
   must be provided:

   - `RPC_URL` – URL of the Solana RPC endpoint. Example:
     `https://api.mainnet-beta.solana.com`.
   - `POOL_ADDRESS` – address of the Orca pool to track.
   - `TOKEN_A_MINT` – mint address of token A in the pool.
   - `TOKEN_B_MINT` – mint address of token B in the pool.
   - `SWAP_PROGRAM_ID` – (optional) swap program ID. Defaults to the standard
     Orca swap program if omitted.

   Example `.env`:
   ```dotenv
   RPC_URL=https://api.mainnet-beta.solana.com
   POOL_ADDRESS=ExamplePoolAddressHere
   TOKEN_A_MINT=ExampleTokenAMint
   TOKEN_B_MINT=ExampleTokenBMint
   # SWAP_PROGRAM_ID=9Ww9vTFpEtGRbUgJcNoEFfZDVLkfuU7pTVt7nGz5dsjZ
   ```

4. **Update `src/utils.js` if needed** – the default values in that file can be
   replaced with the environment variables above or edited directly.

## Running the app

Once dependencies are installed and environment variables are configured, start
the analytics script with:

```bash
npm start
```

The script fetches swap data, calculates volume for each token and prints the
current TVL for the pool.
