import { BytesMessage } from '../model/serialized-message-data'

export function isUint8Array(data: unknown): data is Uint8Array {
  return ArrayBuffer.isView(data)
}

export function isSerializedUint8Array(data: unknown): data is BytesMessage {
  const { type, value } = (data || {}) as BytesMessage

  return type === 'bytes' && typeof value === 'string'
}

function convertBlobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onloadend = () => {
      const base64data = reader.result
      resolve(base64data as string)
    }
    reader.onerror = error => {
      reject(error)
    }
  })
}

export function uint8ArrayToString(bytes: Uint8Array): Promise<string> {
  return convertBlobToBase64(new Blob([bytes]))
}

export function stringToUint8Array(serializedBytes: string): Uint8Array {
  return Uint8Array.from(atob(serializedBytes.substring(37)), c => c.charCodeAt(0))
}

export async function uint8ArrayToSerializedParameter(bytes: Uint8Array): Promise<BytesMessage> {
  return {
    type: 'bytes',
    value: await uint8ArrayToString(bytes),
  }
}
