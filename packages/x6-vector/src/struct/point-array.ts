import { Box } from './box'
import { Matrix } from './matrix'
import { TypeArray } from './type-array'
import { UnitNumber } from './unit-number'

export class PointArray extends TypeArray<[number, number]> {
  bbox() {
    let maxX = Number.NEGATIVE_INFINITY
    let maxY = Number.NEGATIVE_INFINITY
    let minX = Number.POSITIVE_INFINITY
    let minY = Number.POSITIVE_INFINITY

    this.forEach((p) => {
      maxX = Math.max(p[0], maxX)
      maxY = Math.max(p[1], maxY)
      minX = Math.min(p[0], minX)
      minY = Math.min(p[1], minY)
    })

    return new Box(minX, minY, maxX - minX, maxY - minY)
  }

  move(x?: number | string, y?: number | string) {
    const box = this.bbox()
    const dx = typeof x === 'undefined' ? NaN : UnitNumber.toNumber(x) - box.x
    const dy = typeof y === 'undefined' ? NaN : UnitNumber.toNumber(y) - box.y

    if (!Number.isNaN(dx) && !Number.isNaN(dy)) {
      for (let i = this.length - 1; i >= 0; i -= 1) {
        this[i] = [this[i][0] + dx, this[i][1] + dy]
      }
    }

    return this
  }

  parse(raw: string | [number, number][] | number[] = [0, 0]) {
    const array: number[] = Array.isArray(raw)
      ? Array.prototype.concat.apply([], raw)
      : raw
          .trim()
          .split(/[\s,]+/)
          .map((str) => Number.parseFloat(str))

    if (array.length % 2 !== 0) {
      array.pop()
    }

    const points: [number, number][] = []
    for (let i = 0, l = array.length; i < l; i += 2) {
      points.push([array[i], array[i + 1]])
    }

    return points
  }

  size(width: number | string, height: number | string) {
    const box = this.bbox()
    const w = UnitNumber.toNumber(width)
    const h = UnitNumber.toNumber(height)

    for (let i = this.length - 1; i >= 0; i -= 1) {
      if (box.width) {
        this[i][0] = ((this[i][0] - box.x) * w) / box.width + box.x
      }

      if (box.height) {
        this[i][1] = ((this[i][1] - box.y) * h) / box.height + box.y
      }
    }

    return this
  }

  toString() {
    return this.map((item) => item.join(',')).join(' ')
  }

  transform(matrix: Matrix.Raw) {
    return this.clone().transformO(matrix)
  }

  transformO(matrix: Matrix.Raw) {
    const m = Matrix.isMatrixLike(matrix) ? matrix : new Matrix(matrix)
    for (let i = this.length - 1; i >= 0; i -= 1) {
      const [x, y] = this[i]
      this[i][0] = m.a * x + m.c * y + m.e
      this[i][1] = m.b * x + m.d * y + m.f
    }
    return this
  }
}
