export namespace Num {
  export function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value))
  }

  export function closeEnough(a: number, b: number, threshold?: number) {
    return Math.abs(b - a) < (threshold || 1e-6)
  }

  export function radians(degree: number) {
    return ((degree % 360) * Math.PI) / 180
  }
}
