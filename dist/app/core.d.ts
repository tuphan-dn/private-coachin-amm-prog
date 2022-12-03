/// <reference types="node" />
import { web3, Program, BN } from '@project-serum/anchor';
import { PrivateCoachingAmmProgIdl, AnchorWallet, PrivateCoachingAmmProgEvents, PoolData } from './types';
declare class PrivateCoachingAmm {
    private _connection;
    private _provider;
    readonly program: Program<PrivateCoachingAmmProgIdl>;
    constructor(wallet: AnchorWallet, rpcEndpoint?: string, programId?: string);
    /**
     * Get list of event names
     */
    get events(): ("CreatePoolEvent" | "SwapEvent")[];
    /**
     * Listen changes on an event
     * @param eventName Event name
     * @param callback Event handler
     * @returns Listener id
     */
    addListener: <T extends "CreatePoolEvent" | "SwapEvent">(eventName: T, callback: (data: PrivateCoachingAmmProgEvents[T]) => void) => number;
    /**
     * Remove listener by its id
     * @param listenerId Listener id
     * @returns
     */
    removeListener: (listenerId: number) => Promise<void>;
    /**
     * Parse pool buffer data.
     * @param data Pool buffer data.
     * @returns Pool readable data.
     */
    parsePoolData: (data: Buffer) => PoolData;
    /**
     * Get pool data.
     * @param poolAddress Pool address.
     * @returns Pool readable data.
     */
    getPoolData: (poolAddress: string) => Promise<PoolData>;
    /**
     * Derive treasurer address of a pool.
     * @param poolAddress The pool address.
     * @returns Treasurer address that holds the secure token treasuries of the pool.
     */
    deriveTreasurerAddress: (poolAddress: string) => Promise<string>;
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
    createPool: ({ x, y, xTokenAddress, yTokenAddress, pool, }: {
        x: BN;
        y: BN;
        xTokenAddress: string;
        yTokenAddress: string;
        pool?: web3.Keypair | undefined;
    }, sendAndConfirm?: boolean) => Promise<{
        tx: web3.Transaction;
        txId: string;
        poolAddress: string;
    }>;
    swap: ({ a, poolAddress, }: {
        a: BN;
        poolAddress: string;
    }, sendAndConfirm?: boolean) => Promise<{
        tx: web3.Transaction;
        txId: string;
    }>;
}
export default PrivateCoachingAmm;
