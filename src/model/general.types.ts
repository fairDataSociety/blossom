import { FlavoredType } from './flavored.type'

export type Mnemonic = FlavoredType<string, 'Mnemonic'>
/**
 * Ethereum address with 0x prefix
 */
export type Address = FlavoredType<string, 'Address'>
export type PrivateKey = FlavoredType<string, 'PrivateKey'>
export type DappId = FlavoredType<string, 'DappId'>
export type Bytes<length extends number> = FlavoredType<Uint8Array, length>
export type HexString<length extends number> = FlavoredType<string, length>
export type HexStringVariate = FlavoredType<string, 'HexStringVariate'>
export type BigNumberString = FlavoredType<string, 'BigNumberString'>
