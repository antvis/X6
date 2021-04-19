import { Point } from '../../struct/point'
import { Matrix } from '../../struct/matrix'
import { Primer } from '../primer'
import { getTransformOrigin } from './util'

export class Transform<TElement extends Element>
  extends Primer<TElement>
  implements Matrix.Matrixifiable {
  transform(): Matrix.Transform
  transform(type: keyof Matrix.Transform): number
  transform(
    options: Matrix.TransformOptions,
    relative?: boolean | Transform<TElement> | Matrix.Raw,
  ): this
  transform(
    matrix: Matrix.MatrixLike,
    relative?: boolean | Transform<TElement> | Matrix.Raw,
  ): this
  transform(
    o?: keyof Matrix.Transform | Matrix.MatrixLike | Matrix.TransformOptions,
    relative?: boolean | Transform<TElement> | Matrix.Raw,
  ) {
    if (o == null || typeof o === 'string') {
      const decomposed = new Matrix(this).decompose()
      return o == null ? decomposed : decomposed[o]
    }

    const m = Matrix.isMatrixLike(o)
      ? o
      : {
          ...o,
          origin: getTransformOrigin(o, this),
        }

    const cur =
      relative === true ? new Matrix(this) : new Matrix(relative || undefined)
    const ret = cur.transform(m)
    return this.attr('transform', ret.toString())
  }

  untransform() {
    return this.attr('transform', null)
  }

  matrixify(): Matrix {
    const raw = this.attr<string>('transform') || ''
    return (
      raw
        .split(/\)\s*,?\s*/)
        .slice(0, -1)
        .map((str) => {
          const kv = str.trim().split('(')
          return [kv[0], kv[1].split(/[\s,]+/).map((s) => Number.parseFloat(s))]
        })
        .reverse()
        // merge every transformation into one matrix
        .reduce(
          (
            matrix,
            transform: ['matrix' | 'rotate' | 'scale' | 'translate', number[]],
          ) => {
            if (transform[0] === 'matrix') {
              return matrix.lmultiply(
                Matrix.toMatrixLike(transform[1] as Matrix.MatrixArray),
              )
            }
            return matrix[transform[0]].call(matrix, ...transform[1])
          },
          new Matrix(),
        )
    )
  }

  matrix(): Matrix
  matrix(m: Matrix | Matrix.MatrixLike): this
  matrix(a: number, b: number, c: number, d: number, e: number, f: number): this
  matrix(
    a?: Matrix | Matrix.MatrixLike | number,
    b?: number,
    c?: number,
    d?: number,
    e?: number,
    f?: number,
  ) {
    if (a == null) {
      return new Matrix(this)
    }

    const m =
      typeof a === 'number'
        ? new Matrix(
            a,
            b as number,
            c as number,
            d as number,
            e as number,
            f as number,
          )
        : new Matrix(a)

    return this.attr('transform', m.toString())
  }

  rotate(angle: number): this
  rotate(angle: number, cx: number, cy: number): this
  rotate(angle: number, cx?: number, cy?: number) {
    return this.transform({ rotate: angle, ox: cx, oy: cy }, true)
  }

  skew(): this
  skew(s: number): this
  skew(x: number, y: number): this
  skew(s: number, cx: number, cy: number): this
  skew(x: number, y: number, cx: number, cy: number): this
  skew(x?: number, y?: number, cx?: number, cy?: number) {
    return arguments.length === 1 || arguments.length === 3
      ? this.transform({ skew: x, ox: y, oy: cx }, true)
      : this.transform(
          {
            skew: typeof x === 'undefined' ? undefined : [x, y as number],
            ox: cx,
            oy: cy,
          },
          true,
        )
  }

  shear(lam: number): this
  shear(lam: number, cx: number, cy: number): this
  shear(lam: number, cx?: number, cy?: number) {
    return this.transform({ shear: lam, ox: cx, oy: cy }, true)
  }

  scale(): this
  scale(s: number): this
  scale(x: number, y: number): this
  scale(x: number, y: number, cx: number, cy: number): this
  scale(s: number, cx: number, cy: number): this
  scale(x?: number, y?: number, cx?: number, cy?: number) {
    return arguments.length === 1 || arguments.length === 3
      ? this.transform({ scale: x, ox: y, oy: cx }, true)
      : this.transform(
          {
            scale: typeof x === 'undefined' ? undefined : [x, y as number],
            ox: cx,
            oy: cy,
          },
          true,
        )
  }

  translate(x: number, y: number) {
    return this.transform({ translate: [x, y] }, true)
  }

  relative(x: number, y: number) {
    return this.transform({ relative: [x, y] }, true)
  }

  flip(origin?: number | [number, number] | Point.PointLike): this
  flip(
    direction: 'both' | 'x' | 'y',
    origin?: number | [number, number] | Point.PointLike | 'center',
  ): this
  flip(
    direction:
      | 'both'
      | 'x'
      | 'y'
      | number
      | [number, number]
      | Point.PointLike = 'both',
    origin: number | [number, number] | Point.PointLike | 'center' = 'center',
  ) {
    if (typeof direction !== 'string') {
      origin = direction // eslint-disable-line
      direction = 'both' // eslint-disable-line
    }

    return this.transform({ origin, flip: direction }, true)
  }
}
