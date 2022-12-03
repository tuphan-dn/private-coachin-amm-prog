"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const anchor_1 = require("@project-serum/anchor");
const constant_1 = require("./constant");
const utils_1 = require("./utils");
class PrivateCoachingAmm {
    constructor(wallet, rpcEndpoint = constant_1.DEFAULT_RPC_ENDPOINT, programId = constant_1.DEFAULT_PROGRAM_ID) {
        /**
         * Listen changes on an event
         * @param eventName Event name
         * @param callback Event handler
         * @returns Listener id
         */
        this.addListener = (eventName, callback) => {
            return this.program.addEventListener(eventName, (data) => callback(data));
        };
        /**
         * Remove listener by its id
         * @param listenerId Listener id
         * @returns
         */
        this.removeListener = (listenerId) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.program.removeEventListener(listenerId);
            }
            catch (er) {
                console.warn(er.message);
            }
        });
        /**
         * Parse pool buffer data.
         * @param data Pool buffer data.
         * @returns Pool readable data.
         */
        this.parsePoolData = (data) => {
            return this.program.coder.accounts.decode('pool', data);
        };
        /**
         * Get pool data.
         * @param poolAddress Pool address.
         * @returns Pool readable data.
         */
        this.getPoolData = (poolAddress) => __awaiter(this, void 0, void 0, function* () {
            return this.program.account.pool.fetch(poolAddress);
        });
        /**
         * Derive treasurer address of a pool.
         * @param poolAddress The pool address.
         * @returns Treasurer address that holds the secure token treasuries of the pool.
         */
        this.deriveTreasurerAddress = (poolAddress) => __awaiter(this, void 0, void 0, function* () {
            if (!(0, utils_1.isAddress)(poolAddress))
                throw new Error('Invalid pool address');
            const [treasurerPublicKey] = yield anchor_1.web3.PublicKey.findProgramAddress([Buffer.from('treasurer'), new anchor_1.web3.PublicKey(poolAddress).toBuffer()], this.program.programId);
            return treasurerPublicKey.toBase58();
        });
        /**
         * Create a new pool
         * @param opt.x Amount of X tokens
         * @param opt.y Amount of Y tokens
         * @param opt.xTokenAddress X mint address
         * @param opt.yTokenAddress Y mint address
         * @param opt.pool (Optional) Pool keypair
         * @param sendAndConfirm (Optional) Send and confirm the transaction immediately.
         * @returns { tx, txId, poolAddress }
         */
        this.createPool = ({ x, y, xTokenAddress, yTokenAddress, pool = anchor_1.web3.Keypair.generate(), }, sendAndConfirm = true) => __awaiter(this, void 0, void 0, function* () {
            if (!(0, utils_1.isAddress)(xTokenAddress) || !(0, utils_1.isAddress)(yTokenAddress))
                throw new Error('Invalid token address');
            if (!x.gt(new anchor_1.BN(0)) || !y.gt(new anchor_1.BN(0)))
                throw new Error('Token amounts must be greater than zero');
            const xTokenPublicKey = new anchor_1.web3.PublicKey(xTokenAddress);
            const yTokenPublicKey = new anchor_1.web3.PublicKey(yTokenAddress);
            const srcXAccountPublicKey = yield anchor_1.utils.token.associatedAddress({
                mint: xTokenPublicKey,
                owner: this._provider.wallet.publicKey,
            });
            const srcYAccountPublicKey = yield anchor_1.utils.token.associatedAddress({
                mint: yTokenPublicKey,
                owner: this._provider.wallet.publicKey,
            });
            const treasurerAddress = yield this.deriveTreasurerAddress(pool.publicKey.toBase58());
            const treasurerPublicKey = new anchor_1.web3.PublicKey(treasurerAddress);
            const xTreasuryPublicKey = yield anchor_1.utils.token.associatedAddress({
                mint: xTokenPublicKey,
                owner: treasurerPublicKey,
            });
            const yTreasuryPublicKey = yield anchor_1.utils.token.associatedAddress({
                mint: yTokenPublicKey,
                owner: treasurerPublicKey,
            });
            const builder = this.program.methods
                .createPool(x, y)
                .accounts({
                authority: this._provider.wallet.publicKey,
                pool: pool.publicKey,
                xToken: xTokenPublicKey,
                yToken: yTokenPublicKey,
                srcXAccount: srcXAccountPublicKey,
                srcYAccount: srcYAccountPublicKey,
                treasurer: treasurerPublicKey,
                xTreasury: xTreasuryPublicKey,
                yTreasury: yTreasuryPublicKey,
                systemProgram: anchor_1.web3.SystemProgram.programId,
                tokenProgram: anchor_1.utils.token.TOKEN_PROGRAM_ID,
                associatedTokenProgram: anchor_1.utils.token.ASSOCIATED_PROGRAM_ID,
                rent: anchor_1.web3.SYSVAR_RENT_PUBKEY,
            })
                .signers([pool]);
            const tx = yield builder.transaction();
            const txId = sendAndConfirm
                ? yield builder.rpc({ commitment: 'confirmed' })
                : '';
            return { tx, txId, poolAddress: pool.publicKey.toBase58() };
        });
        this.swap = ({ a, poolAddress, }, sendAndConfirm = true) => __awaiter(this, void 0, void 0, function* () {
            if (!(0, utils_1.isAddress)(poolAddress))
                throw new Error('Invalid pool address');
            if (!a.gt(new anchor_1.BN(0)))
                throw new Error('The token amount must be greater than zero');
            const poolPublicKey = new anchor_1.web3.PublicKey(poolAddress);
            const { xToken: xTokenPublicKey, yToken: yTokenPublicKey } = yield this.getPoolData(poolAddress);
            const srcXAccountPublicKey = yield anchor_1.utils.token.associatedAddress({
                mint: xTokenPublicKey,
                owner: this._provider.wallet.publicKey,
            });
            const dstYAccountPublicKey = yield anchor_1.utils.token.associatedAddress({
                mint: yTokenPublicKey,
                owner: this._provider.wallet.publicKey,
            });
            const treasurerAddress = yield this.deriveTreasurerAddress(poolAddress);
            const treasurerPublicKey = new anchor_1.web3.PublicKey(treasurerAddress);
            const xTreasuryPublicKey = yield anchor_1.utils.token.associatedAddress({
                mint: xTokenPublicKey,
                owner: treasurerPublicKey,
            });
            const yTreasuryPublicKey = yield anchor_1.utils.token.associatedAddress({
                mint: yTokenPublicKey,
                owner: treasurerPublicKey,
            });
            const builder = this.program.methods.swap(a).accounts({
                authority: this._provider.wallet.publicKey,
                pool: poolPublicKey,
                xToken: xTokenPublicKey,
                yToken: yTokenPublicKey,
                srcXAccount: srcXAccountPublicKey,
                dstYAccount: dstYAccountPublicKey,
                treasurer: treasurerPublicKey,
                xTreasury: xTreasuryPublicKey,
                yTreasury: yTreasuryPublicKey,
                systemProgram: anchor_1.web3.SystemProgram.programId,
                tokenProgram: anchor_1.utils.token.TOKEN_PROGRAM_ID,
                associatedTokenProgram: anchor_1.utils.token.ASSOCIATED_PROGRAM_ID,
                rent: anchor_1.web3.SYSVAR_RENT_PUBKEY,
            });
            const tx = yield builder.transaction();
            const txId = sendAndConfirm
                ? yield builder.rpc({ commitment: 'confirmed' })
                : '';
            return { tx, txId };
        });
        if (!(0, utils_1.isAddress)(programId))
            throw new Error('Invalid program id');
        // Private
        this._connection = new anchor_1.web3.Connection(rpcEndpoint, 'confirmed');
        this._provider = new anchor_1.AnchorProvider(this._connection, wallet, {
            skipPreflight: true,
            commitment: 'confirmed',
        });
        // Public
        this.program = new anchor_1.Program(constant_1.DEFAULT_IDL, programId, this._provider);
    }
    /**
     * Get list of event names
     */
    get events() {
        return this.program.idl.events.map(({ name }) => name);
    }
}
exports.default = PrivateCoachingAmm;
