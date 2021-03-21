import { round } from '../util'

type Segment = [string, ...number[]]

function rotate(x: number, y: number, rad: number) {
  return {
    x: x * Math.cos(rad) - y * Math.sin(rad),
    y: x * Math.sin(rad) + y * Math.cos(rad),
  }
}

function q2c(
  x1: number,
  y1: number,
  ax: number,
  ay: number,
  x2: number,
  y2: number,
) {
  const v13 = 1 / 3
  const v23 = 2 / 3
  return [
    v13 * x1 + v23 * ax,
    v13 * y1 + v23 * ay,
    v13 * x2 + v23 * ax,
    v13 * y2 + v23 * ay,
    x2,
    y2,
  ]
}

function a2c(
  x1: number,
  y1: number,
  rx: number,
  ry: number,
  angle: number,
  largeArcFlag: number,
  sweepFlag: number,
  x2: number,
  y2: number,
  recursive?: [number, number, number, number],
): any[] {
  // for more information of where this math came from visit:
  // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
  const v120 = (Math.PI * 120) / 180
  const rad = (Math.PI / 180) * (+angle || 0)
  let res = []
  let xy
  let f1
  let f2
  let cx
  let cy

  if (!recursive) {
    xy = rotate(x1, y1, -rad)
    x1 = xy.x // eslint-disable-line
    y1 = xy.y // eslint-disable-line

    xy = rotate(x2, y2, -rad)
    x2 = xy.x // eslint-disable-line
    y2 = xy.y // eslint-disable-line

    const x = (x1 - x2) / 2
    const y = (y1 - y2) / 2
    let h = (x * x) / (rx * rx) + (y * y) / (ry * ry)

    if (h > 1) {
      h = Math.sqrt(h)
      rx = h * rx // eslint-disable-line
      ry = h * ry // eslint-disable-line
    }

    const rx2 = rx * rx
    const ry2 = ry * ry

    const k =
      (largeArcFlag === sweepFlag ? -1 : 1) *
      Math.sqrt(
        Math.abs(
          (rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x),
        ),
      )

    cx = (k * rx * y) / ry + (x1 + x2) / 2
    cy = (k * -ry * x) / rx + (y1 + y2) / 2

    f1 = Math.asin((y1 - cy) / ry)
    f2 = Math.asin((y2 - cy) / ry)

    f1 = x1 < cx ? Math.PI - f1 : f1
    f2 = x2 < cx ? Math.PI - f2 : f2

    if (f1 < 0) {
      f1 = Math.PI * 2 + f1
    }

    if (f2 < 0) {
      f2 = Math.PI * 2 + f2
    }

    if (sweepFlag && f1 > f2) {
      f1 -= Math.PI * 2
    }

    if (!sweepFlag && f2 > f1) {
      f2 -= Math.PI * 2
    }
  } else {
    f1 = recursive[0]
    f2 = recursive[1]
    cx = recursive[2]
    cy = recursive[3]
  }

  let df = f2 - f1
  if (Math.abs(df) > v120) {
    const f2old = f2
    const x2old = x2
    const y2old = y2
    f2 = f1 + v120 * (sweepFlag && f2 > f1 ? 1 : -1)
    x2 = cx + rx * Math.cos(f2) // eslint-disable-line
    y2 = cy + ry * Math.sin(f2) // eslint-disable-line
    res = a2c(x2, y2, rx, ry, angle, 0, sweepFlag, x2old, y2old, [
      f2,
      f2old,
      cx,
      cy,
    ])
  }

  df = f2 - f1

  const c1 = Math.cos(f1)
  const s1 = Math.sin(f1)
  const c2 = Math.cos(f2)
  const s2 = Math.sin(f2)
  const t = Math.tan(df / 4)
  const hx = (4 / 3) * (rx * t)
  const hy = (4 / 3) * (ry * t)
  const m1 = [x1, y1]
  const m2 = [x1 + hx * s1, y1 - hy * c1]
  const m3 = [x2 + hx * s2, y2 - hy * c2]
  const m4 = [x2, y2]

  m2[0] = 2 * m1[0] - m2[0]
  m2[1] = 2 * m1[1] - m2[1]

  if (recursive) {
    return [m2, m3, m4].concat(res)
  }

  {
    res = [m2, m3, m4].concat(res).join().split(',')

    const newres = []
    const ii = res.length
    for (let i = 0; i < ii; i += 1) {
      newres[i] =
        i % 2
          ? rotate(+res[i - 1], +res[i], rad).y
          : rotate(+res[i], +res[i + 1], rad).x
    }
    return newres
  }
}

function parse(pathData: string) {
  if (!pathData) {
    return null
  }

  const spaces =
    '\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029'

  // https://regexper.com/#%28%5Ba-z%5D%29%5B%5Cs%2C%5D*%28%28-%3F%5Cd*%5C.%3F%5C%5Cd*%28%3F%3Ae%5B%5C-%2B%5D%3F%5Cd%2B%29%3F%5B%5Cs%5D*%2C%3F%5B%5Cs%5D*%29%2B%29
  const segmentReg = new RegExp(
    `([a-z])[${spaces},]*((-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?[${spaces}]*,?[${spaces}]*)+)`, // eslint-disable-line
    'ig',
  )

  // https://regexper.com/#%28-%3F%5Cd*%5C.%3F%5Cd*%28%3F%3Ae%5B%5C-%2B%5D%3F%5Cd%2B%29%3F%29%5B%5Cs%5D*%2C%3F%5B%5Cs%5D*
  const commandParamReg = new RegExp(
    // eslint-disable-next-line
    `(-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?)[${spaces}]*,?[${spaces}]*`,
    'ig',
  )

  const paramsCount = {
    a: 7,
    c: 6,
    h: 1,
    l: 2,
    m: 2,
    q: 4,
    s: 4,
    t: 2,
    v: 1,
    z: 0,
  }

  const segmetns: Segment[] = []

  pathData.replace(segmentReg, (input: string, cmd: string, args: string) => {
    const params: number[] = []
    let command = cmd.toLowerCase()

    args.replace(commandParamReg, (a: string, b: string) => {
      if (b) {
        params.push(+b)
      }
      return a
    })

    if (command === 'm' && params.length > 2) {
      segmetns.push([cmd, ...params.splice(0, 2)])
      command = 'l'
      cmd = cmd === 'm' ? 'l' : 'L' // eslint-disable-line
    }

    const count = paramsCount[command as keyof typeof paramsCount]
    while (params.length >= count) {
      segmetns.push([cmd, ...params.splice(0, count)])
      if (!count) {
        break
      }
    }

    return input
  })

  return segmetns
}

function abs(pathString: string) {
  const pathArray = parse(pathString)

  // if invalid string, return 'M 0 0'
  if (!pathArray || !pathArray.length) {
    return [['M', 0, 0]]
  }

  let x = 0
  let y = 0
  let mx = 0
  let my = 0
  const segments = []

  for (let i = 0, ii = pathArray.length; i < ii; i += 1) {
    const r: any = []

    segments.push(r)

    const segment = pathArray[i]
    const command = segment[0]
    if (command !== command.toUpperCase()) {
      r[0] = command.toUpperCase()

      switch (r[0]) {
        case 'A':
          r[1] = segment[1]
          r[2] = segment[2]
          r[3] = segment[3]
          r[4] = segment[4]
          r[5] = segment[5]
          r[6] = +segment[6] + x
          r[7] = +segment[7] + y
          break

        case 'V':
          r[1] = +segment[1] + y
          break

        case 'H':
          r[1] = +segment[1] + x
          break

        case 'M':
          mx = +segment[1] + x
          my = +segment[2] + y

          for (let j = 1, jj = segment.length; j < jj; j += 1) {
            r[j] = +segment[j] + (j % 2 ? x : y)
          }
          break

        default:
          for (let j = 1, jj = segment.length; j < jj; j += 1) {
            r[j] = +segment[j] + (j % 2 ? x : y)
          }
          break
      }
    } else {
      for (let j = 0, jj = segment.length; j < jj; j += 1) {
        r[j] = segment[j]
      }
    }

    switch (r[0]) {
      case 'Z':
        x = +mx
        y = +my
        break

      case 'H':
        x = r[1]
        break

      case 'V':
        y = r[1]
        break

      case 'M':
        mx = r[r.length - 2]
        my = r[r.length - 1]
        x = r[r.length - 2]
        y = r[r.length - 1]
        break

      default:
        x = r[r.length - 2]
        y = r[r.length - 1]
        break
    }
  }

  return segments
}

function normalize(path: string) {
  const pathArray = abs(path)
  const attrs = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null }

  function processPath(path: any[], d: any, pcom: string) {
    let nx
    let ny

    if (!path) {
      return ['C', d.x, d.y, d.x, d.y, d.x, d.y]
    }

    if (!(path[0] in { T: 1, Q: 1 })) {
      d.qx = null
      d.qy = null
    }

    switch (path[0]) {
      case 'M':
        d.X = path[1]
        d.Y = path[2]
        break

      case 'A':
        if (parseFloat(path[1]) === 0 || parseFloat(path[2]) === 0) {
          // https://www.w3.org/TR/SVG/paths.html#ArcOutOfRangeParameters
          // "If either rx or ry is 0, then this arc is treated as a
          // straight line segment (a "lineto") joining the endpoints."
          return ['L', path[6], path[7]]
        }

        return ['C'].concat(a2c.apply(0, [d.x, d.y].concat(path.slice(1))))

      case 'S':
        if (pcom === 'C' || pcom === 'S') {
          // In 'S' case we have to take into account, if the previous command is C/S.
          nx = d.x * 2 - d.bx // And reflect the previous
          ny = d.y * 2 - d.by // command's control point relative to the current point.
        } else {
          // or some else or nothing
          nx = d.x
          ny = d.y
        }
        return ['C', nx, ny].concat(path.slice(1))

      case 'T':
        if (pcom === 'Q' || pcom === 'T') {
          // In 'T' case we have to take into account, if the previous command is Q/T.
          d.qx = d.x * 2 - d.qx // And make a reflection similar
          d.qy = d.y * 2 - d.qy // to case 'S'.
        } else {
          // or something else or nothing
          d.qx = d.x
          d.qy = d.y
        }
        return ['C'].concat(
          q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]) as any[],
        )

      case 'Q':
        d.qx = path[1]
        d.qy = path[2]
        return ['C'].concat(
          q2c(d.x, d.y, path[1], path[2], path[3], path[4]) as any[],
        )

      case 'H':
        return ['L'].concat(path[1], d.y)

      case 'V':
        return ['L'].concat(d.x, path[1])

      case 'L':
        break

      case 'Z':
        break

      default:
        break
    }

    return path
  }

  function fixArc(pp: any[], i: number) {
    if (pp[i].length > 7) {
      pp[i].shift()
      const pi = pp[i]

      while (pi.length) {
        // if created multiple 'C's, their original seg is saved
        commands[i] = 'A'
        i += 1 // eslint-disable-line
        pp.splice(i, 0, ['C'].concat(pi.splice(0, 6)))
      }

      pp.splice(i, 1)
      ii = pathArray.length
    }
  }

  const commands = [] // path commands of original path p
  let prevCommand = '' // holder for previous path command of original path

  let ii = pathArray.length
  for (let i = 0; i < ii; i += 1) {
    let command = '' // temporary holder for original path command

    if (pathArray[i]) {
      command = pathArray[i][0] // save current path command
    }

    if (command !== 'C') {
      // C is not saved yet, because it may be result of conversion
      commands[i] = command // Save current path command
      if (i > 0) {
        prevCommand = commands[i - 1] // Get previous path command pcom
      }
    }

    // Previous path command is inputted to processPath
    pathArray[i] = processPath(pathArray[i], attrs, prevCommand)

    if (commands[i] !== 'A' && command === 'C') {
      commands[i] = 'C' // 'A' is the only command
    }

    // which may produce multiple 'C's
    // so we have to make sure that 'C' is also 'C' in original path

    fixArc(pathArray, i) // fixArc adds also the right amount of 'A's to pcoms

    const seg = pathArray[i]
    const seglen = seg.length

    attrs.x = seg[seglen - 2]
    attrs.y = seg[seglen - 1]

    attrs.bx = parseFloat(seg[seglen - 4]) || attrs.x
    attrs.by = parseFloat(seg[seglen - 3]) || attrs.y
  }

  // make sure normalized path data string starts with an M segment
  if (!pathArray[0][0] || pathArray[0][0] !== 'M') {
    pathArray.unshift(['M', 0, 0])
  }

  return pathArray
}

/**
 * Converts provided SVG path data string into a normalized path data string.
 *
 * The normalization uses a restricted subset of path commands; all segments
 * are translated into lineto, curveto, moveto, and closepath segments.
 *
 * Relative path commands are changed into their absolute counterparts,
 * and chaining of coordinates is disallowed.
 *
 * The function will always return a valid path data string; if an input
 * string cannot be normalized, 'M 0 0' is returned.
 */
export function normalizePathData(pathData: string) {
  return normalize(pathData)
    .map((segment: Segment) =>
      segment.map((item) => (typeof item === 'string' ? item : round(item, 2))),
    )
    .join(',')
    .split(',')
    .join(' ')
}
