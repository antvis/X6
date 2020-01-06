import { Style, ObjectExt, NumberExt, Point, Line } from '@antv/x6'

export function getFactor(
  style: Style,
  defaultFactor: number,
  size: number,
  max: number = 1,
  key: string = 'factor',
) {
  const factor = ObjectExt.getNumber(style, key, defaultFactor)
  return clampFactor(factor, size, max)
}

export function clampFactor(factor: number, size: number, max: number = 1) {
  return factor > 1
    ? NumberExt.clamp(factor, 0, size * max)
    : NumberExt.clamp(factor, 0, max) * size
}

export function getPerimeterPoint(pts: Point[], center: Point, next: Point) {
  let min = null
  const line = new Line(center, next)
  for (let i = 0, ii = pts.length - 1; i < ii; i += 1) {
    const l = new Line(pts[i], pts[i + 1])
    const p = l.intersectionWithLine(line)
    if (p != null) {
      const dx = next.x - p.x
      const dy = next.y - p.y
      const tmp = { p, len: dy * dy + dx * dx }

      if (tmp && (min == null || min.len > tmp.len)) {
        min = tmp
      }
    }
  }

  return min != null ? min.p : null
}
