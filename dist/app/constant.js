"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POOL_DISCRIMINATOR = exports.DEFAULT_IDL = exports.DEFAULT_PROGRAM_ID = exports.DEFAULT_RPC_ENDPOINT = void 0;
const bs58_1 = __importDefault(require("bs58"));
const anchor_1 = require("@project-serum/anchor");
const private_coaching_amm_prog_1 = require("../target/types/private_coaching_amm_prog");
exports.DEFAULT_RPC_ENDPOINT = 'https://api.devnet.solana.com';
exports.DEFAULT_PROGRAM_ID = 'AT9ApNUHABR9bLHzBbKKz2u19U6tzp4SifkKBfX4SpqM';
exports.DEFAULT_IDL = private_coaching_amm_prog_1.IDL;
exports.POOL_DISCRIMINATOR = bs58_1.default.encode(anchor_1.BorshAccountsCoder.accountDiscriminator('pool'));
