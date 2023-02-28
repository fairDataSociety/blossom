export function removeAllValues(array: Array<unknown>, value: unknown) {
  let i = array.length

  while (i--) {
    if (array[i] === value) {
      array.splice(array.indexOf(value), 1)
    }
  }
}

export function restoreUint8Array(data: Record<string, number>): Uint8Array {
  return new Uint8Array(
    Object.keys(data)
      .sort((a, b) => Number(a) - Number(b))
      .map((key) => data[key]),
  )
}
