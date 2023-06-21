export function roundEther(value: string): string {
  const pointIndex = value.indexOf('.')

  if (!pointIndex) {
    return value
  }

  return value.substring(0, pointIndex + 5)
}
