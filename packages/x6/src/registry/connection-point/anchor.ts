import { Line } from '../../geometry'
import { ConnectionPoint } from './index'
import { offset } from './util'

type Align = 'top' | 'right' | 'bottom' | 'left'

export interface AnchorOptions extends ConnectionPoint.BaseOptions {
  align?: Align
  alignOffset?: number
}

function alignLine(line: Line, type: Align, offset = 0) {
  const { start, end } = line
  let a
  let b
  let direction
  let coordinate: 'x' | 'y'

  switch (type) {
    case 'left':
      coordinate = 'x'
      a = end
      b = start
      direction = -1
      break
    case 'right':
      coordinate = 'x'
      a = start
      b = end
      direction = 1
      break
    case 'top':
      coordinate = 'y'
      a = end
      b = start
      direction = -1
      break
    case 'bottom':
      coordinate = 'y'
      a = start
      b = end
      direction = 1
      break
    default:
      return
  }

  if (start[coordinate] < end[coordinate]) {
    a[coordinate] = b[coordinate]
  } else {
    b[coordinate] = a[coordinate]
  }

  if (Number.isFinite(offset)) {
    a[coordinate] += direction * offset
    b[coordinate] += direction * offset
  }
}

/**
 * Places the connection point at the edge's endpoint.
 */
export const anchor: ConnectionPoint.Definition<AnchorOptions> = function (
  line,
  view,
  magnet,
  options,
) {
  const { alignOffset, align } = options
  if (align) {
    alignLine(line, align, alignOffset)
  }
  return offset(line.end, line.start, options.offset)
}
