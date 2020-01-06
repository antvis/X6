export function snapToGrid(value: number, gridSize: number) {
  return gridSize * Math.round(value / gridSize)
}

export function round(num: number, precision: number) {
  const f = Math.pow(10, precision || 0)
  return Math.round(num * f) / f
}

export function random(): number
export function random(max: number): number
export function random(min: number, max: number): number
export function random(min?: number, max?: number): number {
  let mmin
  let mmax

  if (max == null) {
    mmax = min == null ? 1 : min
    mmin = 0
  } else {
    mmax = max
    mmin = min == null ? 0 : min
  }

  if (mmax < mmin) {
    const temp = mmin
    mmin = mmax
    mmax = temp
  }

  return Math.floor(Math.random() * (mmax - mmin + 1) + mmin)
}

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
