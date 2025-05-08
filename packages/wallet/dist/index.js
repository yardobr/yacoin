"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  createTransaction: () => createTransaction,
  createWallet: () => createWallet,
  createWalletAddress: () => createWalletAddress,
  generateKeyPair: () => generateKeyPair,
  getPublicKey: () => getPublicKey,
  sign: () => sign,
  verify: () => verify,
  verifySignature: () => verifySignature,
  verifyTransactionInputSignature: () => verifyTransactionInputSignature
});
module.exports = __toCommonJS(src_exports);

// src/keyPair.ts
var import_elliptic = __toESM(require("elliptic"));
var import_crypto = __toESM(require("crypto"));
var ec = new import_elliptic.default.ec("secp256k1");
var generateKeyPair = () => {
  const keyPair = ec.genKeyPair();
  const privateKey = keyPair.getPrivate("hex");
  const publicKey = keyPair.getPublic("hex");
  return {
    privateKey,
    publicKey
  };
};
var getPublicKey = (privateKey) => {
  const keyPair = ec.keyFromPrivate(privateKey);
  return keyPair.getPublic("hex");
};
var sign = (data, privateKey) => {
  const keyPair = ec.keyFromPrivate(privateKey);
  const hash = import_crypto.default.createHash("sha256").update(data).digest();
  const signature = keyPair.sign(hash);
  return signature.toDER("hex");
};
var verify = (data, signature, publicKey) => {
  try {
    const keyPair = ec.keyFromPublic(publicKey, "hex");
    const hash = import_crypto.default.createHash("sha256").update(data).digest();
    return keyPair.verify(hash, signature);
  } catch (error) {
    console.error("Verification error:", error);
    return false;
  }
};

// src/wallet.ts
var import_crypto2 = __toESM(require("crypto"));
var createWalletAddress = (publicKey) => {
  const publicKeyHash = import_crypto2.default.createHash("sha256").update(publicKey).digest();
  return import_crypto2.default.createHash("ripemd160").update(publicKeyHash).digest("hex");
};
var createWallet = () => {
  const keyPair = generateKeyPair();
  const address = createWalletAddress(keyPair.publicKey);
  return {
    address,
    keyPair
  };
};
var createTransaction = (wallet, recipientAddress, amount, availableUtxos) => {
  const senderUtxos = availableUtxos.filter((utxo) => utxo.address === wallet.address);
  const totalInputAmount = senderUtxos.reduce((sum, utxo) => sum + utxo.amount, 0);
  if (totalInputAmount < amount) {
    console.error("Error: Insufficient funds in wallet.");
    return null;
  }
  const outputs = [];
  outputs.push({ address: recipientAddress, amount });
  const changeAmount = totalInputAmount - amount;
  if (changeAmount > 0) {
    outputs.push({ address: wallet.address, amount: changeAmount });
  }
  const timestamp = Date.now();
  const txToSign = {
    inputs: senderUtxos.map((utxo) => ({
      transactionOutputId: utxo.transactionOutputId,
      outputIndex: utxo.outputIndex
    })),
    outputs,
    timestamp
  };
  const txDataString = JSON.stringify(txToSign.inputs) + JSON.stringify(txToSign.outputs) + txToSign.timestamp;
  const txId = import_crypto2.default.createHash("sha256").update(txDataString).digest("hex");
  const inputs = senderUtxos.map((utxo, index) => {
    const dataToSign = txId + utxo.transactionOutputId + utxo.outputIndex + utxo.amount;
    const signature = sign(dataToSign, wallet.keyPair.privateKey);
    return {
      transactionOutputId: utxo.transactionOutputId,
      outputIndex: utxo.outputIndex,
      signature
    };
  });
  return {
    id: txId,
    inputs,
    outputs,
    timestamp
  };
};

// src/signatureVerification.ts
var verifySignature = (data, signature, address, publicKeyInHex) => {
  const calculatedAddress = createWalletAddress(publicKeyInHex);
  if (calculatedAddress !== address) {
    console.error("Public key does not match address");
    return false;
  }
  return verify(data, signature, publicKeyInHex);
};
var verifyTransactionInputSignature = (txId, outputId, outputIndex, amount, signature, publicKey) => {
  const dataToVerify = txId + outputId + outputIndex + amount;
  const address = createWalletAddress(publicKey);
  return verifySignature(dataToVerify, signature, address, publicKey);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createTransaction,
  createWallet,
  createWalletAddress,
  generateKeyPair,
  getPublicKey,
  sign,
  verify,
  verifySignature,
  verifyTransactionInputSignature
});
//# sourceMappingURL=index.js.map
