export namespace Angle {
  export function toDeg(rad: number) {
    return ((180 * rad) / Math.PI) % 360
  }

  export const toRad = function(deg: number, over360: boolean = false) {
    const d = over360 ? deg : deg % 360
    return (d * Math.PI) / 180
  }

  export function normalize(angle: number) {
    return (angle % 360) + (angle < 0 ? 360 : 0)
  }
}
