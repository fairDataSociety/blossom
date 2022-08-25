import AES from 'crypto-js/aes'
import encHex from 'crypto-js/enc-hex'
import { utils } from 'ethers'
import { Bytes } from '../model/general.types'

function wordsToUint8Array(words: number[]): Uint8Array {
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

export function aesEncryptBytes(bytes: Bytes<64>, key: string): string {
  return AES.encrypt(encHex.parse(utils.hexlify(bytes)), key).toString()
}

export function decryptSeed(seed: string, key: string): Bytes<64> {
  return removePaddingBytesFromSeed(wordsToUint8Array(AES.decrypt(seed, key).words))
}
