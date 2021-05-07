import { Point } from '../../struct/point'

type CommandUpperCase =
  | 'M'
  | 'L'
  | 'H'
  | 'V'
  | 'C'
  | 'S'
  | 'Q'
  | 'T'
  | 'A'
  | 'Z'

type CommandLowerCase =
  | 'm'
  | 'l'
  | 'h'
  | 'v'
  | 'c'
  | 's'
  | 'q'
  | 't'
  | 'a'
  | 'z'

type Command = CommandUpperCase | CommandLowerCase

export type Segment = [Command, ...number[]]

interface Options {
  segment: Segment
  segments: Segment[]

  lastToken: string
  lastCommand: Command

  inNumber: boolean
  number: string
  inSegment: boolean
  hasDecimal: boolean
  hasExponent: boolean

  absolute: boolean
  p0: Point
  p: Point
}

type Hnadler = (parameters: number[], p: Point, p0: Point) => Segment

const upperHandler: { [key in CommandUpperCase]: Hnadler } = {
  M(c, p, p0) {
    p.x = p0.x = c[0]
    p.y = p0.y = c[1]
    return ['M', p.x, p.y]
  },
  L(c, p) {
    p.x = c[0]
    p.y = c[1]
    return ['L', c[0], c[1]]
  },
  H(c, p) {
    p.x = c[0]
    return ['H', c[0]]
  },
  V(c, p) {
    p.y = c[0]
    return ['V', c[0]]
  },
  C(c, p) {
    p.x = c[4]
    p.y = c[5]
    return ['C', c[0], c[1], c[2], c[3], c[4], c[5]]
  },
  S(c, p) {
    p.x = c[2]
    p.y = c[3]
    return ['S', c[0], c[1], c[2], c[3]]
  },
  Q(c, p) {
    p.x = c[2]
    p.y = c[3]
    return ['Q', c[0], c[1], c[2], c[3]]
  },
  T(c, p) {
    p.x = c[0]
    p.y = c[1]
    return ['T', c[0], c[1]]
  },
  Z(c, p, p0) {
    p.x = p0.x
    p.y = p0.y
    return ['Z']
  },
  A(c, p) {
    p.x = c[5]
    p.y = c[6]
    return ['A', c[0], c[1], c[2], c[3], c[4], c[5], c[6]]
  },
}

const handlers: { [key in Command]: Hnadler } = { ...upperHandler } as any

Object.keys(upperHandler).forEach((upper: CommandUpperCase) => {
  const lower = upper.toLowerCase() as CommandLowerCase
  handlers[lower] = (c: number[], p: Point, p0: Point) => {
    if (upper === 'H') {
      c[0] += p.x
    } else if (upper === 'V') {
      c[0] += p.y
    } else if (upper === 'A') {
      c[5] += p.x
      c[6] += p.y
    } else {
      for (let i = 0, l = c.length; i < l; i += 1) {
        c[i] += i % 2 ? p.y : p.x
      }
    }

    return handlers[upper](c, p, p0)
  }
})

function isCommand(token: string): token is Command {
  return /[achlmqstvz]/i.test(token)
}

function isSegmentComplete(parser: Options) {
  const count = parser.segment.length
  if (count > 0) {
    const parameterMap = {
      M: 2,
      L: 2,
      H: 1,
      V: 1,
      C: 6,
      S: 4,
      Q: 4,
      T: 2,
      A: 7,
      Z: 0,
    }
    const cmd = parser.segment[0].toUpperCase() as CommandUpperCase
    return count === parameterMap[cmd] + 1
  }
  return false
}

function startNewSegment(parser: Options, token: string) {
  if (parser.inNumber) {
    finalizeNumber(parser, false)
  }

  const isNewCommand = isCommand(token)
  if (isNewCommand) {
    parser.segment = [token as Command]
  } else {
    const { lastCommand } = parser
    const small = lastCommand.toLowerCase()
    const isSmall = lastCommand === small
    parser.segment = [small === 'm' ? (isSmall ? 'l' : 'L') : lastCommand]
  }

  parser.inSegment = true
  parser.lastCommand = parser.segment[0]

  return isNewCommand
}

function finalizeSegment(parser: Options) {
  parser.inSegment = false
  if (parser.absolute) {
    parser.segment = toAbsolut(parser)
  }
  parser.segments.push(parser.segment)
}

function finalizeNumber(parser: Options, inNumber: boolean) {
  if (!parser.inNumber) {
    throw new Error('Parser Error')
  }

  if (parser.number) {
    parser.segment.push(Number.parseFloat(parser.number))
  }

  parser.number = ''
  parser.inNumber = inNumber
  parser.hasDecimal = false
  parser.hasExponent = false

  if (isSegmentComplete(parser)) {
    finalizeSegment(parser)
  }
}

function toAbsolut(parser: Options) {
  const command = parser.segment[0]
  const args = parser.segment.slice(1) as number[]
  return handlers[command](args, parser.p, parser.p0)
}

function isArcFlag(parser: Options) {
  if (parser.segment.length === 0) {
    return false
  }
  const isArc = parser.segment[0].toUpperCase() === 'A'
  const { length } = parser.segment
  return isArc && (length === 4 || length === 5)
}

function isExponential(parser: Options) {
  return parser.lastToken.toUpperCase() === 'E'
}

export function parse(d: string, toAbsolute = true) {
  let index = 0
  let token = ''

  const parser: Options = {
    segment: null as any,
    segments: [],
    inNumber: false,
    number: '',
    lastToken: '',
    lastCommand: null as any,
    inSegment: false,
    hasDecimal: false,
    hasExponent: false,
    absolute: toAbsolute,
    p0: new Point(),
    p: new Point(),
  }

  while (((parser.lastToken = token), (token = d.charAt(index)))) {
    index += 1

    if (!parser.inSegment) {
      if (
        (!isCommand(token) && !parser.lastCommand) ||
        startNewSegment(parser, token)
      ) {
        continue
      }
    }

    if (token === '.') {
      if (parser.hasDecimal || parser.hasExponent) {
        finalizeNumber(parser, false)
        index -= 1
        continue
      }
      parser.inNumber = true
      parser.hasDecimal = true
      parser.number += token
      continue
    }

    if (!Number.isNaN(Number.parseInt(token, 10))) {
      if (parser.number === '0' || (parser.inNumber && isArcFlag(parser))) {
        finalizeNumber(parser, true)
      }

      parser.inNumber = true
      parser.number += token
      continue
    }

    if (token === ' ' || token === ',') {
      if (parser.inNumber) {
        finalizeNumber(parser, false)
      }
      continue
    }

    if (token === '-') {
      if (parser.inNumber && !isExponential(parser)) {
        finalizeNumber(parser, false)
        index -= 1
        continue
      }
      parser.number += token
      parser.inNumber = true
      continue
    }

    if (token.toUpperCase() === 'E') {
      parser.number += token
      parser.hasExponent = true
      continue
    }

    if (isCommand(token)) {
      if (parser.inNumber) {
        finalizeNumber(parser, false)
      } else if (!isSegmentComplete(parser)) {
        throw new Error('parser Error')
      } else {
        finalizeSegment(parser)
      }
      index -= 1
    }
  }

  if (parser.inNumber) {
    finalizeNumber(parser, false)
  }

  if (parser.inSegment && isSegmentComplete(parser)) {
    finalizeSegment(parser)
  }

  return parser.segments
}

export function toString(segments: Segment[]) {
  return segments.reduce<string>((memo, seg) => {
    let ret = memo

    ret += seg[0]

    if (seg[1] != null) {
      ret += seg[1]

      if (seg[2] != null) {
        ret += ' '
        ret += seg[2]

        if (seg[3] != null) {
          ret += ' '
          ret += seg[3]
          ret += ' '
          ret += seg[4]

          if (seg[5] != null) {
            ret += ' '
            ret += seg[5]
            ret += ' '
            ret += seg[6]

            if (seg[7] != null) {
              ret += ' '
              ret += seg[7]
            }
          }
        }
      }
    }

    return ret
  }, '')
}
