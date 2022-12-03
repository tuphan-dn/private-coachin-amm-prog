import { web3, Program, utils, BN, AnchorProvider } from '@project-serum/anchor'

import {
  DEFAULT_RPC_ENDPOINT,
  DEFAULT_PROGRAM_ID,
  DEFAULT_IDL,
} from './constant'
import {
  PrivateCoachingAmmProgIdl,
  AnchorWallet,
  PrivateCoachingAmmProgEvents,
  PoolData,
} from './types'
import { isAddress } from './utils'

class PrivateCoachingAmm {
  private _connection: web3.Connection
  private _provider: AnchorProvider
  readonly program: Program<PrivateCoachingAmmProgIdl>

  constructor(
    wallet: AnchorWallet,
    rpcEndpoint: string = DEFAULT_RPC_ENDPOINT,
    programId: string = DEFAULT_PROGRAM_ID,
  ) {
    if (!isAddress(programId)) throw new Error('Invalid program id')
    // Private
    this._connection = new web3.Connection(rpcEndpoint, 'confirmed')
    this._provider = new AnchorProvider(this._connection, wallet, {
      skipPreflight: true,
      commitment: 'confirmed',
    })
    // Public
    this.program = new Program<PrivateCoachingAmmProgIdl>(
      DEFAULT_IDL,
      programId,
      this._provider,
    )
  }
}

export default PrivateCoachingAmm
