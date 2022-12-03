import { web3 } from '@project-serum/anchor'

/**
 * Validate an address
 * @param address Base58 string
 * @returns true/false
 */
export const isAddress = (address: string | undefined): address is string => {
  if (!address) return false
  try {
    const publicKey = new web3.PublicKey(address)
    if (!publicKey) throw new Error('Invalid public key')
    return true
  } catch (er) {
    return false
  }
}
