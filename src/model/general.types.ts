import { FlavoredType } from './flavored.type'

export type Mnemonic = FlavoredType<string, 'Mnemonic'>
export type Account = FlavoredType<string, 'Account'>
export type PrivateKey = FlavoredType<string, 'PrivateKey'>
