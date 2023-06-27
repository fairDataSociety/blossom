export const valueRegex = /^\d+(\.\d+)?$/g
export const addressRegex = /^0x[a-fA-F0-9]{40}$/g

export function roundEther(value: string): string {
  const pointIndex = value.indexOf('.')

  if (!pointIndex) {
    return value
  }

  return value.substring(0, pointIndex + 5)
}

export function isValueValid(value: string): boolean {
  return valueRegex.test(value)
}

export function isAddressValid(address: string): boolean {
  return addressRegex.test(address)
}
