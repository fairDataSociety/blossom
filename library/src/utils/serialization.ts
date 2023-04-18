import { BytesMessage } from '../model/serialized-message-data'

const BASE64_MIME_TYPE = 'data:application/octet-stream;base64,'

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
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

export function uint8ArrayToBase64(bytes: Uint8Array): Promise<string> {
  return convertBlobToBase64(new Blob([bytes]))
}

export function base64ToUint8Array(base64String: string): Uint8Array {
  return Uint8Array.from(
    atob(
      base64String.startsWith(BASE64_MIME_TYPE)
        ? base64String.substring(BASE64_MIME_TYPE.length)
        : base64String,
    ),
    c => c.charCodeAt(0),
  )
}

export async function uint8ArrayToSerializedParameter(bytes: Uint8Array): Promise<BytesMessage> {
  return {
    type: 'bytes',
    value: await uint8ArrayToBase64(bytes),
  }
}
