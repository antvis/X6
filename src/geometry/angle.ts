export namespace Angle {
  /**
   * Converts radian angle to degree angle.
   * @param rad The radians to convert.
   */
  export function toDeg(rad: number) {
    return ((180 * rad) / Math.PI) % 360
  }

  /**
   * Converts degree angle to radian angle.
   * @param deg The degree angle to convert.
   * @param over360
   */
  export const toRad = function (deg: number, over360 = false) {
    const d = over360 ? deg : deg % 360
    return (d * Math.PI) / 180
  }

  /**
   * Returns the angle in degrees and clamps its value between `0` and `360`.
   */
  export function normalize(angle: number) {
    return (angle % 360) + (angle < 0 ? 360 : 0)
  }
}
