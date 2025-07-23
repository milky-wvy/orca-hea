const { connection, POOL_ADDRESS, TOKEN_A_MINT, TOKEN_B_MINT, SWAP_PROGRAM_ID } = require("./utils");
const base64 = require("base-64");
const bs58 = require("bs58");

function decodeSwapInstruction(data) {
  let buffer;
  if (typeof data === "string") {
    try {
      buffer = Buffer.from(data, "base64");
    } catch (_) {
      buffer = bs58.decode(data);
    }
  } else {
    buffer = Buffer.from(data);
  }

  if (buffer.length < 17) return null;
  const instruction = buffer.readUInt8(0);
  if (instruction !== 1) return null;

  const amountIn = Number(buffer.readBigUInt64LE(1));
  const minAmountOut = Number(buffer.readBigUInt64LE(9));

  return { amountIn, minAmountOut };
}

async function getAllSignatures(poolAddress) {
  let allSignatures = [];
  let before = undefined;

  while (true) {
    const res = await connection.getSignaturesForAddress(poolAddress, { before, limit: 1000 });
    if (res.length === 0) break;
    allSignatures = allSignatures.concat(res);
    before = res[res.length - 1].signature;
    console.log(`Fetched ${allSignatures.length} signatures so far...`);
  }
  return allSignatures;
}

async function getTokenBalance(mint, owner) {
  const res = await connection.getParsedTokenAccountsByOwner(owner, { mint });
  let total = 0;
  for (const { account } of res.value) {
    const amount = parseInt(account.data.parsed.info.tokenAmount.amount);
    total += amount;
  }
  return total;
}

async function getVolumeAndTVL() {
  const signatures = await getAllSignatures(POOL_ADDRESS);
  let volumeTokenA = 0;
  let volumeTokenB = 0;

  for (const sigInfo of signatures) {
    const tx = await connection.getTransaction(sigInfo.signature, { maxSupportedTransactionVersion: 0 });
    if (!tx || !tx.transaction) continue;

    const instructions = tx.transaction.message.instructions;

    for (const inst of instructions) {
      if (!inst.programId.equals(SWAP_PROGRAM_ID)) continue;

      try {
        const amounts = decodeSwapInstruction(inst.data);
        if (amounts) {
          volumeTokenA += amounts.amountIn;
          volumeTokenB += amounts.minAmountOut;
        }
      } catch (e) {
        console.error("Error decoding instruction:", e);
      }
    }
  }

  const tokenABalance = await getTokenBalance(TOKEN_A_MINT, POOL_ADDRESS);
  const tokenBBalance = await getTokenBalance(TOKEN_B_MINT, POOL_ADDRESS);

  console.log("Total Volume Token A:", volumeTokenA);
  console.log("Total Volume Token B:", volumeTokenB);
  console.log("TVL Token A:", tokenABalance);
  console.log("TVL Token B:", tokenBBalance);
}

module.exports = { getVolumeAndTVL };
