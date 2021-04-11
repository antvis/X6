export function closeEnough(a: number, b: number, threshold?: number) {
  return Math.abs(b - a) < (threshold || 1e-6)
}

export function toRad(degree: number) {
  return ((degree % 360) * Math.PI) / 180
}
