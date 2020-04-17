export function getString(
  value: string | null | undefined,
  defaultValue: string,
) {
  return value != null ? value : defaultValue
}

export function getNumber(
  num: number | null | undefined,
  defaultValue: number,
) {
  return num != null && isFinite(num) ? num : defaultValue
}
