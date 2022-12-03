import bs58 from 'bs58'
import { BorshAccountsCoder } from '@project-serum/anchor'

import { IDL } from '../target/types/private_coaching_amm_prog'

export const DEFAULT_RPC_ENDPOINT = 'https://api.devnet.solana.com'
export const DEFAULT_PROGRAM_ID = 'AT9ApNUHABR9bLHzBbKKz2u19U6tzp4SifkKBfX4SpqM'
export const DEFAULT_IDL = IDL

export const POOL_DISCRIMINATOR = bs58.encode(
  BorshAccountsCoder.accountDiscriminator('pool'),
)
