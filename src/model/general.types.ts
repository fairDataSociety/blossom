import { FlavoredType } from './flavored.type'

export type Mnemonic = FlavoredType<string, 'Mnemonic'>
/**
 * Ethereum address
 */
export type Account = FlavoredType<string, 'Account'>
export type PrivateKey = FlavoredType<string, 'PrivateKey'>
export type DappId = FlavoredType<string, 'DappId'>
export type Bytes<length extends number> = FlavoredType<Uint8Array, length>
