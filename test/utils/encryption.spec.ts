import { encrypt, decrypt, bytesToWordArray, wordArrayToBytes } from '../../src/utils/encryption'

function randomIntegerString(): string {
  return Math.random().toString().slice(2)
}

describe('utils/encryption.ts module tests', () => {
  test('Encryption and decryption of a random seed should return the same value', () => {
    const bytes = new Uint8Array(64)

    for (let i = 0; i < 64; i++) {
      bytes[i] = Number.parseInt(randomIntegerString())
    }

    const key = randomIntegerString()

    const encryptedString = encrypt(key, bytesToWordArray(bytes))

    const decryptedBytes = wordArrayToBytes(decrypt(key, encryptedString))

    expect(decryptedBytes).toEqual(bytes)
  })
})
