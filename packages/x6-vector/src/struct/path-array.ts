import { DomUtil } from '../util/dom'
import type { Path } from '../element/shape/path'
import * as PathUtil from '../element/shape/path-util'
import { Box } from './box'
import { TArray } from './tarray'
import { UNumber } from './unumber'

export class PathArray extends TArray<Path.Segment> {
  bbox() {
    return DomUtil.withPathContect((path) => {
      path.setAttribute('d', this.toString())
      return new Box(path.getBBox())
    })
  }

  move(x?: number | string, y?: number | string) {
    const box = this.bbox()
    const dx = typeof x === 'undefined' ? NaN : UNumber.toNumber(x) - box.x
    const dy = typeof y === 'undefined' ? NaN : UNumber.toNumber(y) - box.y

    if (!Number.isNaN(dx) && !Number.isNaN(dy)) {
      for (let i = this.length - 1; i >= 0; i -= 1) {
        const seg = this[i]
        const cmd = seg[0]

        if (cmd === 'M' || cmd === 'L' || cmd === 'T') {
          seg[1] += dx
          seg[2] += dy
        } else if (cmd === 'H') {
          seg[1] += dx
        } else if (cmd === 'V') {
          seg[1] += dy
        } else if (cmd === 'C' || cmd === 'S' || cmd === 'Q') {
          seg[1] += dx
          seg[2] += dy
          seg[3] += dx
          seg[4] += dy

          if (cmd === 'C') {
            seg[5] += dx
            seg[6] += dy
          }
        } else if (cmd === 'A') {
          seg[6] += dx
          seg[7] += dy
        }
      }
    }

    return this
  }

  size(width: number | string, height: number | string) {
    const box = this.bbox()
    const w = UNumber.toNumber(width)
    const h = UNumber.toNumber(height)

    // If the box width or height is 0 then we ignore
    // transformations on the respective axis
    box.width = box.width === 0 ? 1 : box.width
    box.height = box.height === 0 ? 1 : box.height

    // recalculate position of all points according to new size
    for (let i = this.length - 1; i >= 0; i -= 1) {
      const seg = this[i]
      const cmd = seg[0]

      if (cmd === 'M' || cmd === 'L' || cmd === 'T') {
        seg[1] = ((seg[1] - box.x) * w) / box.width + box.x
        seg[2] = ((seg[2] - box.y) * h) / box.height + box.y
      } else if (cmd === 'H') {
        seg[1] = ((seg[1] - box.x) * w) / box.width + box.x
      } else if (cmd === 'V') {
        seg[1] = ((seg[1] - box.y) * h) / box.height + box.y
      } else if (cmd === 'C' || cmd === 'S' || cmd === 'Q') {
        seg[1] = ((seg[1] - box.x) * w) / box.width + box.x
        seg[2] = ((seg[2] - box.y) * h) / box.height + box.y
        seg[3] = ((seg[3] - box.x) * w) / box.width + box.x
        seg[4] = ((seg[4] - box.y) * h) / box.height + box.y

        if (cmd === 'C') {
          seg[5] = ((seg[5] - box.x) * w) / box.width + box.x
          seg[6] = ((seg[6] - box.y) * h) / box.height + box.y
        }
      } else if (cmd === 'A') {
        // resize radii
        seg[1] = (seg[1] * w) / box.width
        seg[2] = (seg[2] * h) / box.height

        // move position values
        seg[6] = ((seg[6] - box.x) * w) / box.width + box.x
        seg[7] = ((seg[7] - box.y) * h) / box.height + box.y
      }
    }

    return this
  }

  parse(d: string | number[] | Path.Segment[] = 'M0 0') {
    return PathUtil.parse(
      Array.isArray(d) ? Array.prototype.concat.apply([], d).toString() : d,
    )
  }

  toString(): string {
    return PathUtil.toString(this)
  }
}
