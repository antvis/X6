export function clamp(value: number, min: number, max: number) {
  if (isNaN(value)) {
    return NaN
  }

  if (isNaN(min) || isNaN(max)) {
    return 0
  }

  return min < max
    ? value < min
      ? min
      : value > max
      ? max
      : value
    : value < max
    ? max
    : value > min
    ? min
    : value
}
