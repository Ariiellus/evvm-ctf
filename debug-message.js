// Debug script to verify the exact message being signed

const evvmID = "1034";
const functionName = "pay";
const to = "0x5288690d2d1833ee058683055c968196e3a77bf2";
const token = "0x0000000000000000000000000000000000000001";
const amount = "500000000000000000000";
const priorityFee = "1";
const nonce = "2440080103";
const priorityFlag = "true";
const executor = "0x5288690d2d1833ee058683055c968196e3a77bf2";

const message = `${evvmID},${functionName},${to},${token},${amount},${priorityFee},${nonce},${priorityFlag},${executor}`;

console.log("Message that should be signed:");
console.log(message);
console.log("\nMessage length:", message.length);
console.log("\nEIP-191 prefix would be:");
console.log(`\\x19Ethereum Signed Message:\\n${message.length}`);
console.log("\nFull message for hashing:");
console.log(`\\x19Ethereum Signed Message:\\n${message.length}${message}`);

// Calculate hash
const crypto = require('crypto');
const prefix = `\x19Ethereum Signed Message:\n${message.length}`;
const fullMessage = prefix + message;
const hash = crypto.createHash('sha256').update(fullMessage, 'utf8').digest('hex');
console.log("\nMessage hash (keccak256 would be different, this is just for reference):");
console.log("0x" + hash);
