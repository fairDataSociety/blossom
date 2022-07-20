export function removeAllValues(array: Array<unknown>, value: unknown) {
  let i = array.length

  while (i--) {
    if (array[i] === value) {
      array.splice(array.indexOf(value), 1)
    }
  }
}
