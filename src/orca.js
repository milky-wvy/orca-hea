const { connection, POOL_ADDRESS, TOKEN_A_MINT, TOKEN_B_MINT, SWAP_PROGRAM_ID } = require("./utils");
const base64 = require("base-64");

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
  const res = await connection.getTokenAccountsByOwner(owner, { mint });
  let total = 0;
  for (const acc of res.value) {
    const data = acc.account.data;
    const decoded = JSON.parse(Buffer.from(data[0], data[1] === 'base64' ? 'base64' : 'utf8').toString());
    const amount = parseInt(decoded?.parsed?.info?.tokenAmount?.amount || 0);
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
        const data = inst.data;
        const decoded = base64.decode(data);
        // TODO: нормальный разбор swap'ов
        volumeTokenA += 1;
        volumeTokenB += 1;
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
