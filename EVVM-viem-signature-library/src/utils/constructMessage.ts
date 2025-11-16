/**
 * constructMessage
 *
 * Utility functions to construct message strings for EVVM, NameService, and Staking signatures.
 * Each function builds a formatted message for a specific contract action, encoding all required parameters.
 * Used for signing and verifying transactions.
 */
/**
 * Constructs a message for depositing funds in EVVM Fisher.
 * @param isERC20 Whether the token is an ERC20 token or native currency
 * @param receiverAddress Address that will receive the deposit
 * @param nonce Unique number to prevent replay attacks
 * @param tokenAddress Address of the token contract (only for ERC20)
 * @param priorityFee Fee amount for transaction priority
 * @param ammount Amount of tokens/currency to deposit
 * @returns Formatted message string for Fisher deposit
 */
/**
 * Construct a message for payMateStaking_async/sync or payNoMateStaking_async/sync in EVVM.
 * @param to Address of the receiver
 * @param tokenAddress Address of the token
 * @param amount Amount of the token
 * @param priorityFee Priority fee of the transaction
 * @param nonce Nonce of the transaction
 * @param priorityFlag Priority of the transaction
 * @param executor Executor of the transaction
 * @returns Message for payMateStaking_async/sync or payNoMateStaking_async/sync
 */
/**
 * Constructs a message for depositing funds in EVVM Fisher
 * @param isERC20 - Whether the token is an ERC20 token or native currency
 * @param receiverAddress - Address that will receive the deposit
 * @param nonce - Unique number to prevent replay attacks
 * @param tokenAddress - Address of the token contract (only for ERC20)
 * @param priorityFee - Fee amount for transaction priority
 * @param ammount - Amount of tokens/currency to deposit
 * @returns Formatted message string for Fisher deposit
 */
function constructMessageForDepositFisher(
  isERC20: boolean,
  receiverAddress: string,
  nonce: bigint,
  tokenAddress: string,
  priorityFee: string,
  ammount: string,
): string {
  // For ERC20 tokens, include token address in the message
  // For native currency, exclude token address
  return isERC20
    ? `${receiverAddress.toLowerCase()},${nonce},${tokenAddress.toLowerCase()},${priorityFee},${ammount}`
    : `${receiverAddress.toLowerCase()},${nonce},${priorityFee},${ammount}`;
}

/*
┏━━━━━━━━━━━━━━━━┓
 EVVM Signatures  
┗━━━━━━━━━━━━━━━━┛
*/
//・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈

/**
 * Construct a message for payMateStaking_async/sync or payNoMateStaking_async/sync in EVVM
 * @param to address of the receiver
 * @param tokenAddress address of the token
 * @param amount amount of the token
 * @param priorityFee priority fee of the transaction
 * @param nonce nonce of the transaction
 * @param priorityFlag priority of the transaction
 * @param executor executor of the transaction
 * @returns message for payMateStaking_async/sync or payNoMateStaking_async/sync
 */
function buildMessageSignedForPay(
  evvmID: bigint,
  to: `0x${string}` | string,
  tokenAddress: `0x${string}`,
  amount: bigint,
  priorityFee: bigint,
  nonce: bigint,
  priorityFlag: boolean,
  executor: `0x${string}`,
): string {
  if (typeof to !== "string" || !to) {
    throw new Error(
      "Invalid 'to' address passed to buildMessageSignedForPay: value is undefined or not a string",
    );
  }
  const inputs: string =
    `${to.startsWith("0x") ? to.toLowerCase() : to},` +
    `${tokenAddress.toLowerCase()},` +
    `${amount.toString()},` +
    `${priorityFee.toString()},` +
    `${nonce.toString()},` +
    `${priorityFlag ? "true" : "false"},` +
    `${executor.toLowerCase()}`;

  const message = basicMessageBuilder(evvmID.toString(), "pay", inputs);
  console.log("[DEBUG] buildMessageSignedForPay - Message to sign:", message);
  console.log("[DEBUG] buildMessageSignedForPay - Message length:", message.length);
  return message;
}

/**
 * Builds a formatted message string for dispersed payment signing.
 *
 * This function constructs a message by concatenating a fixed prefix with various
 * payment parameters, separated by commas. Token and executor addresses are
 * normalized to lowercase for consistency.
 *
 * @param fixedHashedEncodedData - The fixed hashed encoded data used as a base for the message
 * @param TokenAddress - The token contract address (will be converted to lowercase)
 * @param Ammount - The payment amount as a string
 * @param PriorityFee - The priority fee amount as a string
 * @param Nonce - The transaction nonce value as a string
 * @param PriorityConverted - Boolean flag indicating if priority has been converted
 * @param Executor - The executor address (will be converted to lowercase)
 *
 * @returns A formatted string starting with 'ef83c1d6' followed by comma-separated parameters
 */
function buildMessageSignedForDispersePay(
  evvmID: bigint,
  hashList: string,
  tokenAddress: `0x${string}`,
  amount: bigint,
  priorityFee: bigint,
  nonce: bigint,
  priorityFlag: boolean,
  executor: `0x${string}`,
): string {
  const inputs: string =
    `${"0x" + hashList.toUpperCase().slice(2)},` +
    // the token address is always an address so we use toLowerCase() to avoid case sensitivity issues
    `${tokenAddress.toLowerCase()},` +
    // the amount is set all in decimal format
    `${amount.toString()},` +
    // the priority fee is set all in decimal format
    `${priorityFee.toString()},` +
    // the nonce to avoid replay attacks
    `${nonce.toString()},` +
    // the priority flag is set to "true" or "false" as a string
    `${priorityFlag ? "true" : "false"},` +
    // the executor is the address of the fisher or service that will execute the transaction
    // we use toLowerCase() to avoid case sensitivity issues
    `${executor.toLowerCase()}`;

  return basicMessageBuilder(evvmID.toString(), "dispersePay", inputs);
}

//・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈
/*
┏━━━━━━━━━━━━━━━━━━━┓
 staking Signatures   
┗━━━━━━━━━━━━━━━━━━━┛
*/
//・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈

function buildMessageSignedForPublicStaking(
  evvmID: bigint,
  isStaking: boolean,
  amountOfSMate: bigint,
  nonce: bigint,
): string {
  const inputs: string =
    `${isStaking ? "true" : "false"},` +
    `${amountOfSMate.toString()},` +
    `${nonce.toString()}`;

  return basicMessageBuilder(evvmID.toString(), "publicStaking", inputs);
}

function buildMessageSignedForPresaleStaking(
  evvmID: bigint,
  isStaking: boolean,
  amountOfSMate: bigint,
  nonce: bigint,
): string {
  const inputs: string =
    `${isStaking ? "true" : "false"},` +
    `${amountOfSMate.toLocaleString()},` +
    `${nonce.toLocaleString()}`;

  return basicMessageBuilder(evvmID.toString(), "presaleStaking", inputs);
}

function buildMessageSignedForPublicServiceStake(
  evvmID: bigint,
  serviceAddress: string,
  isStaking: boolean,
  amountOfSMate: bigint,
  nonce: bigint,
): string {
  const inputs: string =
    `${serviceAddress.toLowerCase()},` +
    `${isStaking ? "true" : "false"},` +
    `${amountOfSMate.toString()},` +
    `${nonce.toString()}`;

  return basicMessageBuilder(evvmID.toString(), "publicServiceStaking", inputs);
}

//・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈
/*
┏━━━━━━━━━━━━━━━━━━━━━━━━┓
 Name service Signatures  
┗━━━━━━━━━━━━━━━━━━━━━━━━┛
*/
//・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈

function buildMessageSignedForPreRegistrationUsername(
  evvmID: bigint,
  hashUsername: string,
  nonceNameService: bigint,
): string {
  const inputs: string =
    `${
      hashUsername.toLowerCase().slice(0, 2) +
      hashUsername.toUpperCase().slice(2)
    },` + `${nonceNameService.toString()}`;

  return basicMessageBuilder(
    evvmID.toString(),
    "preRegistrationUsername",
    inputs,
  );
}

function buildMessageSignedForRegistrationEmail(
  evvmID: bigint,
  email: string,
  clowNumber: bigint,
  nonceNameService: bigint,
): string {
  const inputs: string =
    `${email},` +
    `${clowNumber.toString()},` +
    `${nonceNameService.toString()}`;

  return basicMessageBuilder(evvmID.toString(), "registrationEmail", inputs);
}

function buildMessageSignedForRegistrationPhoneNumber(
  evvmID: bigint,
  phoneNumber: string,
  clowNumber: bigint,
  nonceNameService: bigint,
): string {
  const inputs: string =
    `${phoneNumber},` +
    `${clowNumber.toString()},` +
    `${nonceNameService.toString()}`;

  return basicMessageBuilder(evvmID.toString(), "registrationPhoneNumber", inputs);
}

function buildMessageSignedForRegistrationUsername(
  evvmID: bigint,
  username: string,
  clowNumber: bigint,
  nonceNameService: bigint,
): string {
  const inputs: string =
    `${username},` +
    `${clowNumber.toString()},` +
    `${nonceNameService.toString()}`;

  return basicMessageBuilder(evvmID.toString(), "registrationUsername", inputs);
}

function buildMessageSignedForMakeOffer(
  evvmID: bigint,
  username: string,
  dateExpire: bigint,
  amount: bigint,
  nonceNameService: bigint,
): string {
  const inputs: string =
    `${username},` +
    `${dateExpire.toString()},` +
    `${amount.toString()},` +
    `${nonceNameService.toString()}`;

  return basicMessageBuilder(evvmID.toString(), "makeOffer", inputs);
}

function buildMessageSignedForWithdrawOffer(
  evvmID: bigint,
  username: string,
  offerId: bigint,
  mateNameServiceNonce: bigint,
): string {
  const inputs: string =
    `${username},` +
    `${offerId.toString()},` +
    `${mateNameServiceNonce.toString()}`;

  return basicMessageBuilder(evvmID.toString(), "withdrawOffer", inputs);
}

function buildMessageSignedForAcceptOffer(
  evvmID: bigint,
  username: string,
  offerId: bigint,
  mateNameServiceNonce: bigint,
): string {
  const inputs: string =
    `${username},` +
    `${offerId.toString()},` +
    `${mateNameServiceNonce.toString()}`;

  return basicMessageBuilder(evvmID.toString(), "acceptOffer", inputs);
}

function buildMessageSignedForRenewUsername(
  evvmID: bigint,
  username: string,
  mateNameServiceNonce: bigint,
): string {
  const inputs: string = `${username},` + `${mateNameServiceNonce.toString()}`;

  return basicMessageBuilder(evvmID.toString(), "renewUsername", inputs);
}

function buildMessageSignedForAddCustomMetadata(
  evvmID: bigint,
  identity: string,
  value: string,
  mateNameServiceNonce: bigint,
): string {
  const inputs: string =
    `${identity},` + `${value},` + `${mateNameServiceNonce.toString()}`;

  return basicMessageBuilder(evvmID.toString(), "addCustomMetadata", inputs);
}

function buildMessageSignedForRemoveCustomMetadata(
  evvmID: bigint,
  identity: string,
  key: bigint,
  nonceNameService: bigint,
): string {
  const inputs: string =
    `${identity},` + `${key.toString()},` + `${nonceNameService.toString()}`;

  return basicMessageBuilder(evvmID.toString(), "removeCustomMetadata", inputs);
}

function buildMessageSignedForFlushCustomMetadata(
  evvmID: bigint,
  identity: string,
  nonceNameService: bigint,
): string {
  const inputs: string = `${identity},` + `${nonceNameService.toString()}`;

  return basicMessageBuilder(evvmID.toString(), "flushCustomMetadata", inputs);
}

function buildMessageSignedForFlushUsername(
  evvmID: bigint,
  username: string,
  nonceNameService: bigint,
): string {
  const inputs: string = `${username},` + `${nonceNameService.toString()}`;

  return basicMessageBuilder(evvmID.toString(), "flushUsername", inputs);
}

function buildMessageSignedForFlushEmail(
  evvmID: bigint,
  email: string,
  nonceNameService: bigint,
): string {
  const inputs: string = `${email},` + `${nonceNameService.toString()}`;

  return basicMessageBuilder(evvmID.toString(), "flushEmail", inputs);
}

function buildMessageSignedForFlushPhoneNumber(
  evvmID: bigint,
  phoneNumber: string,
  nonceNameService: bigint,
): string {
  const inputs: string = `${phoneNumber},` + `${nonceNameService.toString()}`;

  return basicMessageBuilder(evvmID.toString(), "flushPhoneNumber", inputs);
}

//・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈
/*
┏━━━━━━━━━━━━━━━━━━━━━━━━┓
 P2P Swap Signatures  
┗━━━━━━━━━━━━━━━━━━━━━━━━┛
*/
//・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈

function buildMessageSignedForMakeOrder(
  evvmID: bigint,
  nonce: bigint,
  tokenA: string,
  tokenB: string,
  amountA: string,
  amountB: string,
): string {
  const inputs: string =
    `${nonce.toString()},` +
    `${tokenA},` +
    `${tokenB},` +
    `${amountA},` +
    `${amountB}`;

  return basicMessageBuilder(evvmID.toString(), "makeOrder", inputs);
}

function buildMessageSignedForCancelOrder(
  evvmID: bigint,
  nonce: bigint,
  tokenA: string,
  tokenB: string,
  orderId: bigint
): string {
  const inputs: string =
    `${nonce.toString()},` +
    `${tokenA},` +
    `${tokenB},` +
    `${orderId.toString()}`;

  return basicMessageBuilder(evvmID.toString(), "cancelOrder", inputs);
}

function buildMessageSignedForDispatchOrder(
  evvmID: bigint,
  nonce: bigint,
  tokenA: string,
  tokenB: string,
  orderId: bigint
): string {
  const inputs: string =
    `${nonce.toString()},` +
    `${tokenA},` +
    `${tokenB},` +
    `${orderId.toString()}`;

  return basicMessageBuilder(evvmID.toString(), "dispatchOrder", inputs);
}

//・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈・┈┈

function basicMessageBuilder(
  evvmID: string,
  functionName: string,
  inputs: string,
): string {
  return evvmID + "," + functionName + "," + inputs;
}

export {
  constructMessageForDepositFisher,
  buildMessageSignedForPay,
  buildMessageSignedForDispersePay,
  buildMessageSignedForPublicStaking,
  buildMessageSignedForPresaleStaking,
  buildMessageSignedForPublicServiceStake,
  buildMessageSignedForPreRegistrationUsername,
  buildMessageSignedForRegistrationEmail,
  buildMessageSignedForRegistrationPhoneNumber,
  buildMessageSignedForRegistrationUsername,
  buildMessageSignedForFlushUsername,
  buildMessageSignedForFlushEmail,
  buildMessageSignedForFlushPhoneNumber,
  buildMessageSignedForMakeOffer,
  buildMessageSignedForWithdrawOffer,
  buildMessageSignedForAcceptOffer,
  buildMessageSignedForRenewUsername,
  buildMessageSignedForAddCustomMetadata,
  buildMessageSignedForRemoveCustomMetadata,
  buildMessageSignedForFlushCustomMetadata,
  buildMessageSignedForMakeOrder,
  buildMessageSignedForCancelOrder,
  buildMessageSignedForDispatchOrder,
  basicMessageBuilder,
};
