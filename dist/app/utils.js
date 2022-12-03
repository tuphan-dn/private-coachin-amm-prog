"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAddress = void 0;
const anchor_1 = require("@project-serum/anchor");
/**
 * Validate an address
 * @param address Base58 string
 * @returns true/false
 */
const isAddress = (address) => {
    if (!address)
        return false;
    try {
        const publicKey = new anchor_1.web3.PublicKey(address);
        if (!publicKey)
            throw new Error('Invalid public key');
        return true;
    }
    catch (er) {
        return false;
    }
};
exports.isAddress = isAddress;
