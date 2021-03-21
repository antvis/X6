import { Point } from '../point'

const regexSupportedData = new RegExp(`^[\\s\\dLMCZz,.]*$`)

export function isValid(data: any) {
  if (typeof data !== 'string') {
    return false
  }

  return regexSupportedData.test(data)
}

/**
 * Returns the remainder of division of `n` by `m`. You should use this
 * instead of the built-in operation as the built-in operation does not
 * properly handle negative numbers.
 */
function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

export interface DrawPointsOptions {
  round?: number
  initialMove?: boolean
  close?: boolean
  exclude?: number[]
}

function draw(
  points: Point.PointLike[],
  round?: number,
  initialMove?: boolean,
  close?: boolean,
  exclude?: number[],
) {
  const data: (string | number)[] = []
  const end = points[points.length - 1]
  const rounded = round != null && round > 0
  const arcSize = round || 0

  // Adds virtual waypoint in the center between start and end point
  if (close && rounded) {
    points = points.slice() // eslint-disable-line
    const p0 = points[0]
    const wp = new Point(end.x + (p0.x - end.x) / 2, end.y + (p0.y - end.y) / 2)
    points.splice(0, 0, wp)
  }

  let pt = points[0]
  let i = 1

  // Draws the line segments
  if (initialMove) {
    data.push('M', pt.x, pt.y)
  } else {
    data.push('L', pt.x, pt.y)
  }

  while (i < (close ? points.length : points.length - 1)) {
    let tmp = points[mod(i, points.length)]
    let dx = pt.x - tmp.x
    let dy = pt.y - tmp.y

    if (
      rounded &&
      (dx !== 0 || dy !== 0) &&
      (exclude == null || exclude.indexOf(i - 1) < 0)
    ) {
      // Draws a line from the last point to the current
      // point with a spacing of size off the current point
      // into direction of the last point
      let dist = Math.sqrt(dx * dx + dy * dy)
      const nx1 = (dx * Math.min(arcSize, dist / 2)) / dist
      const ny1 = (dy * Math.min(arcSize, dist / 2)) / dist

      const x1 = tmp.x + nx1
      const y1 = tmp.y + ny1
      data.push('L', x1, y1)

      // Draws a curve from the last point to the current
      // point with a spacing of size off the current point
      // into direction of the next point
      let next = points[mod(i + 1, points.length)]

      // Uses next non-overlapping point
      while (
        i < points.length - 2 &&
        Math.round(next.x - tmp.x) === 0 &&
        Math.round(next.y - tmp.y) === 0
      ) {
        next = points[mod(i + 2, points.length)]
        i += 1
      }

      dx = next.x - tmp.x
      dy = next.y - tmp.y

      dist = Math.max(1, Math.sqrt(dx * dx + dy * dy))
      const nx2 = (dx * Math.min(arcSize, dist / 2)) / dist
      const ny2 = (dy * Math.min(arcSize, dist / 2)) / dist

      const x2 = tmp.x + nx2
      const y2 = tmp.y + ny2

      data.push('Q', tmp.x, tmp.y, x2, y2)
      tmp = new Point(x2, y2)
    } else {
      data.push('L', tmp.x, tmp.y)
    }

    pt = tmp
    i += 1
  }

  if (close) {
    data.push('Z')
  } else {
    data.push('L', end.x, end.y)
  }

  return data.map((v) => (typeof v === 'string' ? v : +v.toFixed(3))).join(' ')
}

export function drawPoints(
  points: (Point.PointLike | Point.PointData)[],
  options: DrawPointsOptions = {},
) {
  const pts: Point.PointLike[] = []
  if (points && points.length) {
    points.forEach((p) => {
      if (Array.isArray(p)) {
        pts.push({ x: p[0], y: p[1] })
      } else {
        pts.push({ x: p.x, y: p.y })
      }
    })
  }

  return draw(
    pts,
    options.round,
    options.initialMove == null || options.initialMove,
    options.close,
    options.exclude,
  )
}

/**
 * Converts the given arc to a series of curves.
 */
export function arcToCurves(
  x0: number,
  y0: number,
  r1: number,
  r2: number,
  angle = 0,
  largeArcFlag = 0,
  sweepFlag = 0,
  x: number,
  y: number,
) {
  if (r1 === 0 || r2 === 0) {
    return []
  }

  x -= x0 // eslint-disable-line
  y -= y0 // eslint-disable-line
  r1 = Math.abs(r1) // eslint-disable-line
  r2 = Math.abs(r2) // eslint-disable-line

  const ctx = -x / 2
  const cty = -y / 2
  const cpsi = Math.cos((angle * Math.PI) / 180)
  const spsi = Math.sin((angle * Math.PI) / 180)
  const rxd = cpsi * ctx + spsi * cty
  const ryd = -1 * spsi * ctx + cpsi * cty
  const rxdd = rxd * rxd
  const rydd = ryd * ryd
  const r1x = r1 * r1
  const r2y = r2 * r2
  const lamda = rxdd / r1x + rydd / r2y

  let sds

  if (lamda > 1) {
    r1 = Math.sqrt(lamda) * r1 // eslint-disable-line
    r2 = Math.sqrt(lamda) * r2 // eslint-disable-line
    sds = 0
  } else {
    let seif = 1
    if (largeArcFlag === sweepFlag) {
      seif = -1
    }

    sds =
      seif *
      Math.sqrt(
        (r1x * r2y - r1x * rydd - r2y * rxdd) / (r1x * rydd + r2y * rxdd),
      )
  }

  const txd = (sds * r1 * ryd) / r2
  const tyd = (-1 * sds * r2 * rxd) / r1
  const tx = cpsi * txd - spsi * tyd + x / 2
  const ty = spsi * txd + cpsi * tyd + y / 2

  let rad = Math.atan2((ryd - tyd) / r2, (rxd - txd) / r1) - Math.atan2(0, 1)
  let s1 = rad >= 0 ? rad : 2 * Math.PI + rad
  rad =
    Math.atan2((-ryd - tyd) / r2, (-rxd - txd) / r1) -
    Math.atan2((ryd - tyd) / r2, (rxd - txd) / r1)
  let dr = rad >= 0 ? rad : 2 * Math.PI + rad

  if (sweepFlag === 0 && dr > 0) {
    dr -= 2 * Math.PI
  } else if (sweepFlag !== 0 && dr < 0) {
    dr += 2 * Math.PI
  }

  const sse = (dr * 2) / Math.PI
  const seg = Math.ceil(sse < 0 ? -1 * sse : sse)
  const segr = dr / seg
  const t =
    ((8 / 3) * Math.sin(segr / 4) * Math.sin(segr / 4)) / Math.sin(segr / 2)
  const cpsir1 = cpsi * r1
  const cpsir2 = cpsi * r2
  const spsir1 = spsi * r1
  const spsir2 = spsi * r2

  let mc = Math.cos(s1)
  let ms = Math.sin(s1)
  let x2 = -t * (cpsir1 * ms + spsir2 * mc)
  let y2 = -t * (spsir1 * ms - cpsir2 * mc)
  let x3 = 0
  let y3 = 0

  const result = []

  for (let n = 0; n < seg; n += 1) {
    s1 += segr
    mc = Math.cos(s1)
    ms = Math.sin(s1)

    x3 = cpsir1 * mc - spsir2 * ms + tx
    y3 = spsir1 * mc + cpsir2 * ms + ty
    const dx = -t * (cpsir1 * ms + spsir2 * mc)
    const dy = -t * (spsir1 * ms - cpsir2 * mc)

    // CurveTo updates x0, y0 so need to restore it
    const index = n * 6
    result[index] = Number(x2 + x0)
    result[index + 1] = Number(y2 + y0)
    result[index + 2] = Number(x3 - dx + x0)
    result[index + 3] = Number(y3 - dy + y0)
    result[index + 4] = Number(x3 + x0)
    result[index + 5] = Number(y3 + y0)

    x2 = x3 + dx
    y2 = y3 + dy
  }

  return result.map((num) => +num.toFixed(2))
}

export function drawArc(
  startX: number,
  startY: number,
  rx: number,
  ry: number,
  xAxisRotation = 0,
  largeArcFlag: 0 | 1 = 0,
  sweepFlag: 0 | 1 = 0,
  stopX: number,
  stopY: number,
) {
  const data: (string | number)[] = []
  const points = arcToCurves(
    startX,
    startY,
    rx,
    ry,
    xAxisRotation,
    largeArcFlag,
    sweepFlag,
    stopX,
    stopY,
  )

  if (points != null) {
    for (let i = 0, ii = points.length; i < ii; i += 6) {
      data.push(
        'C',
        points[i],
        points[i + 1],
        points[i + 2],
        points[i + 3],
        points[i + 4],
        points[i + 5],
      )
    }
  }

  return data.join(' ')
}
