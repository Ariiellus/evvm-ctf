const { createWalletClient, http, createPublicClient } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');

// The message that SHOULD be signed
const evvmID = "0";
const to = "0x5288690d2d1833ee058683055c968196e3a77bf2";
const token = "0x0000000000000000000000000000000000000001";
const amount = "500000000000000000000";
const priorityFee = "1";
const nonce = "2440080103";
const priorityFlag = "true";
const executor = "0x5288690d2d1833ee058683055c968196e3a77bf2";

const message = `${evvmID},pay,${to},${token},${amount},${priorityFee},${nonce},${priorityFlag},${executor}`;

console.log("Message to sign:");
console.log(message);
console.log("\nExpected signer: 0x292154FdbAB290e1cAcA71328b054cC575fB00cb");
console.log("Actual signature: 0x64ef7c8469224bbbb31b7317c3c8d757edc77ad4b3e7969ef75e10f4a7122e3730b6c3453ad4bfe4f6bf3fcc8528df401508954b1986709becc1d71ebcc6dc211b");
console.log("Recovered signer from contract: 0xd5ef0fb54d115c6296d8781314250b2d7ec2c773");
