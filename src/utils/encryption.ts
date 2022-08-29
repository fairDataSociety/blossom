import CryptoJS from 'crypto-js'
import { Bytes, HexString } from '../model/general.types'

export const IV_LENGTH = 16

/**
 * Converts array of number or Uint8Array to HexString without prefix.
 *
 * @param bytes   The input array
 * @param len     The length of the non prefixed HexString
 */
export function bytesToHex<Length extends number = number>(
  bytes: Uint8Array,
  len?: Length,
): HexString<Length> {
  const hexByte = (n: number) => n.toString(16).padStart(2, '0')
  const hex = Array.from(bytes, hexByte).join('') as HexString<Length>

  if (len && hex.length !== len) {
    throw new TypeError(`Resulting HexString does not have expected length ${len}: ${hex}`)
  }

  return hex
}

/**
 * Converts a hex string to Uint8Array
 *
 * @param hex string input without 0x prefix!
 */
export function hexToBytes<Length extends number, LengthHex extends number = number>(
  hex: HexString<LengthHex>,
): Bytes<Length> {
  const bytes = new Uint8Array(hex.length / 2) as Bytes<Length>
  for (let i = 0; i < bytes.length; i++) {
    const hexByte = hex.substr(i * 2, 2)
    bytes[i] = parseInt(hexByte, 16)
  }

  return bytes as Bytes<Length>
}

/**
 * Converts CryptoJS WordArray to hex string
 */
export function wordArrayToHex<LengthHex extends number = number>(
  words: CryptoJS.lib.WordArray,
): HexString<LengthHex> {
  return CryptoJS.enc.Hex.stringify(words)
}

/**
 * Converts hex string to CryptoJS WordArray
 */
export function hexToWordArray<LengthHex extends number = number>(
  hex: HexString<LengthHex>,
): CryptoJS.lib.WordArray {
  return CryptoJS.enc.Hex.parse(hex)
}

/**
 * Converts bytes to CryptoJS WordArray
 */
export function bytesToWordArray(data: Uint8Array): CryptoJS.lib.WordArray {
  return CryptoJS.enc.Hex.parse(bytesToHex(data))
}

/**
 * Converts CryptoJS WordArray to bytes
 */
export function wordArrayToBytes(words: CryptoJS.lib.WordArray): Uint8Array {
  return hexToBytes(CryptoJS.enc.Hex.stringify(words))
}

/**
 * Encrypt WordArray with password
 *
 * @param password string for text encryption
 * @param data WordArray to be encrypted
 * @param customIv initial vector for AES. In case of absence, a random vector will be created
 */
export function encrypt(
  password: string,
  data: CryptoJS.lib.WordArray | string,
  customIv?: CryptoJS.lib.WordArray,
): CryptoJS.lib.WordArray {
  const iv = customIv || CryptoJS.lib.WordArray.random(IV_LENGTH)
  const key = CryptoJS.SHA256(password)

  const cipherParams = CryptoJS.AES.encrypt(data, key, {
    iv,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.NoPadding,
  })

  return iv.concat(cipherParams.ciphertext)
}

/**
 * Decrypts WordsArray with password
 *
 * @param password string to decrypt bytes
 * @param data WordsArray to be decrypted
 */
export function decrypt(password: string, data: CryptoJS.lib.WordArray): CryptoJS.lib.WordArray {
  const wordSize = 4
  const key = CryptoJS.SHA256(password)
  const iv = CryptoJS.lib.WordArray.create(data.words.slice(0, IV_LENGTH), IV_LENGTH)
  const textBytes = CryptoJS.lib.WordArray.create(
    data.words.slice(IV_LENGTH / wordSize),
    data.sigBytes - IV_LENGTH,
  )
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: textBytes,
  })

  return CryptoJS.AES.decrypt(cipherParams, key, {
    iv,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.NoPadding,
  })
}
