import AES from 'crypto-js/aes'
import encHex from 'crypto-js/enc-hex'
import WordArray from 'crypto-js/lib-typedarrays'
import sha3 from 'crypto-js/sha3'
import pbkdf2 from 'crypto-js/pbkdf2'
import { utils } from 'ethers'
import { Bytes } from '../model/general.types'

export function wordsToUint8Array(words: number[]): Uint8Array {
  const length = words.length
  const unit8Array = new Uint8Array(length << 2)
  let offset = 0
  let word

  for (let i = 0; i < length; i++) {
    word = words[i]
    unit8Array[offset++] = word >> 24
    unit8Array[offset++] = (word >> 16) & 0xff
    unit8Array[offset++] = (word >> 8) & 0xff
    unit8Array[offset++] = word & 0xff
  }

  return unit8Array
}

export function wordsToWordArray(words: number[]): WordArray {
  return WordArray.create(words)
}

/**
 * Removes bytes that are added by AES algorithm.
 * @param seed Array of bytes returned by AES after decryption of a seed
 * @returns real 64 bytes of a seed
 */
function removePaddingBytesFromSeed(seed: Bytes<80>): Bytes<64> {
  const length = seed.length
  const unit8Array = new Uint8Array(length - 16)

  for (let i = 1; i < length - 15; i++) {
    unit8Array[i - 1] = seed[i]
  }

  return unit8Array
}

export function aesEncyptSeedWithBytesKey(bytes: Bytes<64>, key: WordArray): string {
  return AES.encrypt(bytesToWordArray(bytes), key.toString()).toString()
}

export function aesEncryptSeedWithStringKey(bytes: Bytes<64>, key: string): string {
  return AES.encrypt(bytesToWordArray(bytes), key).toString()
}

export function decryptSeedWithBytesKey(seed: string, key: WordArray): Bytes<64> {
  return removePaddingBytesFromSeed(wordsToUint8Array(AES.decrypt(seed, key.toString()).words))
}

export function decryptSeed(seed: string, key: string): Bytes<64> {
  return removePaddingBytesFromSeed(wordsToUint8Array(AES.decrypt(seed, key).words))
}

export function seedToString(seed: Bytes<64>): string {
  return JSON.stringify(seed)
}

export function seedToBytes(seed: string): Bytes<64> {
  const seedObject = JSON.parse(seed)

  const bytes = new Uint8Array(64)

  for (let i = 0; i < 64; i++) {
    bytes[i] = Number(seedObject[i])
  }

  return bytes
}

export function generateSalt(): WordArray {
  return WordArray.random(128 / 8)
}

export function passwordToKey(password: string, salt: WordArray): WordArray {
  return pbkdf2(password, salt, {
    keySize: 512 / 32,
    iterations: 1000,
  })
}

export function bytesToWordArray(bytes: Uint8Array): WordArray {
  return encHex.parse(utils.hexlify(bytes))
}

export function hashSeed(seed: Uint8Array): WordArray {
  return sha3(bytesToWordArray(seed))
}
