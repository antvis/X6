import { Num } from '../util/num'

export class Matrix implements Matrix.MatrixLike {
  a: number
  b: number
  c: number
  d: number
  e: number
  f: number

  constructor()
  constructor(
    a?: number,
    b?: number,
    c?: number,
    d?: number,
    e?: number,
    f?: number,
  )
  constructor(string: string)
  constructor(element: Matrix.Matrixifiable | null)
  constructor(array: Matrix.MatrixArray)
  constructor(matrix: Matrix.MatrixLike)
  constructor(options: Matrix.TransformOptions)
  constructor(
    a?:
      | number
      | string
      | Matrix.Matrixifiable
      | Matrix.MatrixArray
      | Matrix.MatrixLike
      | Matrix.TransformOptions
      | null,
    b?: number,
    c?: number,
    d?: number,
    e?: number,
    f?: number,
  )
  constructor(
    a?:
      | number
      | string
      | Matrix.Matrixifiable
      | Matrix.MatrixArray
      | Matrix.MatrixLike
      | Matrix.TransformOptions
      | null,
    b?: number,
    c?: number,
    d?: number,
    e?: number,
    f?: number,
  ) {
    const base = Matrix.toMatrixLike([1, 0, 0, 1, 0, 0])
    const source =
      a == null
        ? base
        : (a as Matrix.Matrixifiable).matrixify != null
        ? (a as Matrix.Matrixifiable).matrixify()
        : typeof a === 'string'
        ? Matrix.toMatrixLike(
            a.split(/[\s,]+/).map(parseFloat) as Matrix.MatrixArray,
          )
        : Array.isArray(a)
        ? Matrix.toMatrixLike(a)
        : typeof a === 'object' && Matrix.isMatrixLike(a)
        ? a
        : typeof a === 'object'
        ? new Matrix().transform(a as Matrix.TransformOptions)
        : typeof a === 'number'
        ? Matrix.toMatrixLike([
            a,
            b as number,
            c as number,
            d as number,
            e as number,
            f as number,
          ])
        : base

    this.a = source.a != null ? source.a : base.a
    this.b = source.b != null ? source.b : base.b
    this.c = source.c != null ? source.c : base.c
    this.d = source.d != null ? source.d : base.d
    this.e = source.e != null ? source.e : base.e
    this.f = source.f != null ? source.f : base.f
  }

  clone() {
    return new Matrix(this)
  }

  equals(other: Matrix.Raw) {
    if (other instanceof Matrix && other === this) {
      return true
    }
    const comp = new Matrix(other)
    return (
      Num.closeEnough(this.a, comp.a) &&
      Num.closeEnough(this.b, comp.b) &&
      Num.closeEnough(this.c, comp.c) &&
      Num.closeEnough(this.d, comp.d) &&
      Num.closeEnough(this.e, comp.e) &&
      Num.closeEnough(this.f, comp.f)
    )
  }

  decompose(ox = 0, oy = 0) {
    const { a, b, c, d, e, f } = this

    // Figure out if the winding direction is clockwise or counterclockwise
    const determinant = a * d - b * c
    const ccw = determinant > 0 ? 1 : -1

    // Since we only shear in x, we can use the x basis to get the x scale
    // and the rotation of the resulting matrix
    const sx = ccw * Math.sqrt(a * a + b * b)
    const thetaRad = Math.atan2(ccw * b, ccw * a)
    const theta = (180 / Math.PI) * thetaRad
    const ct = Math.cos(thetaRad)
    const st = Math.sin(thetaRad)

    // We can then solve the y basis vector simultaneously to get the other
    // two affine parameters directly from these parameters
    const lam = (a * c + b * d) / determinant
    const sy = (c * sx) / (lam * a - b) || (d * sx) / (lam * b + a)

    const tx = e - ox + ox * ct * sx + oy * (lam * ct * sx - st * sy)
    const ty = f - oy + ox * st * sx + oy * (lam * st * sx + ct * sy)

    return {
      // affine parameters
      scaleX: sx,
      scaleY: sy,
      shear: lam,
      rotate: theta,
      translateX: tx,
      translateY: ty,
      originX: ox,
      originY: oy,

      // matrix parameters
      a: this.a,
      b: this.b,
      c: this.c,
      d: this.d,
      e: this.e,
      f: this.f,
    }
  }

  around(cx: number, cy: number, matrix: Matrix.Raw) {
    return this.clone().aroundO(cx, cy, matrix)
  }

  aroundO(cx: number | undefined, cy: number | undefined, matrix: Matrix.Raw) {
    const dx = cx || 0
    const dy = cy || 0
    return this.translateO(-dx, -dy).lmultiplyO(matrix).translateO(dx, dy)
  }

  scale(s: number): Matrix
  scale(x: number, y: number): Matrix
  scale(s: number, cx: number, cy: number): Matrix
  scale(x: number, y: number, cx: number, cy: number): Matrix
  scale(x: number, y?: number, cx?: number, cy?: number) {
    return this.clone().scaleO(x, y, cx, cy)
  }

  scaleO(s: number): this
  scaleO(sx: number, sy: number): this
  scaleO(s: number, cx: number, cy: number): this
  scaleO(sx: number, sy: number, cx: number, cy: number): this
  scaleO(sx: number, sy?: number, cx?: number, cy?: number): this
  scaleO(sx: number, sy?: number, cx?: number, cy?: number) {
    if (typeof cy === 'undefined') {
      if (typeof cx === 'undefined') {
        cx = 0 // eslint-disable-line
        cy = 0 // eslint-disable-line
        if (typeof sy === 'undefined') {
          sy = sx // eslint-disable-line
        }
      } else {
        cy = cx // eslint-disable-line
        cx = sy // eslint-disable-line
        sy = sx // eslint-disable-line
      }
    }

    const { a, b, c, d, e, f } = this

    this.a = a * sx
    this.b = b * (sy as number)
    this.c = c * sx
    this.d = d * (sy as number)
    this.e = e * sx - (cx as number) * sx + (cx as number)
    this.f = f * (sy as number) - cy * (sy as number) + cy

    return this
  }

  flip(): Matrix
  flip(cx: number, cy?: number): Matrix
  flip(axis: 'x' | 'y', around?: number): Matrix
  flip(axis?: 'x' | 'y' | number, around?: number) {
    return this.clone().flipO(axis, around)
  }

  flipO(): this
  flipO(cx: number, cy?: number): this
  flipO(axis: 'x' | 'y', around?: number): this
  flipO(axis?: 'x' | 'y' | number, around?: number): this
  flipO(axis: 'x' | 'y' | number = 0, around = 0): this {
    return axis === 'x'
      ? this.scaleO(-1, 1, around, 0)
      : axis === 'y'
      ? this.scaleO(1, -1, 0, around)
      : this.scaleO(-1, -1, axis, around || axis) // Define an x, y flip point
  }

  inverse() {
    return this.clone().inverseO()
  }

  inverseO() {
    const { a, b, c, d, e, f } = this

    // Invert the 2x2 matrix in the top left
    const det = a * d - b * c
    if (!det) {
      throw new Error(`Cannot invert ${this.toString()}`)
    }

    // Calculate the top 2x2 matrix
    const na = d / det
    const nb = -b / det
    const nc = -c / det
    const nd = a / det

    // Apply the inverted matrix to the top right
    const ne = -(na * e + nc * f)
    const nf = -(nb * e + nd * f)

    // Construct the inverted matrix
    this.a = na
    this.b = nb
    this.c = nc
    this.d = nd
    this.e = ne
    this.f = nf

    return this
  }

  lmultiply(matrix: Matrix.Raw) {
    return this.clone().lmultiplyO(matrix)
  }

  lmultiplyO(matrix: Matrix.Raw) {
    return Matrix.multiply(
      matrix instanceof Matrix ? matrix : new Matrix(matrix),
      this,
      this,
    )
  }

  multiply(matrix: Matrix.Raw) {
    return this.clone().multiplyO(matrix)
  }

  multiplyO(matrix: Matrix.Raw) {
    return Matrix.multiply(
      this,
      matrix instanceof Matrix ? matrix : new Matrix(matrix),
      this,
    )
  }

  rotate(degree: number): Matrix
  rotate(degree: number, cx: number, cy: number): Matrix
  rotate(degree: number, cx?: number, cy?: number) {
    return this.clone().rotateO(degree, cx, cy)
  }

  rotateO(degree: number): this
  rotateO(degree: number, cx: number, cy: number): this
  rotateO(degree: number, cx?: number, cy?: number): this
  rotateO(degrees: number, cx = 0, cy = 0) {
    const radian = Num.radians(degrees)
    const cos = Math.cos(radian)
    const sin = Math.sin(radian)

    const { a, b, c, d, e, f } = this

    this.a = a * cos - b * sin
    this.b = b * cos + a * sin
    this.c = c * cos - d * sin
    this.d = d * cos + c * sin
    this.e = e * cos - f * sin + cy * sin - cx * cos + cx
    this.f = f * cos + e * sin - cx * sin - cy * cos + cy

    return this
  }

  shear(a: number): Matrix
  shear(a: number, cx: number, cy: number): Matrix
  shear(a: number, cx?: number, cy?: number) {
    return this.clone().shearO(a, cx, cy)
  }

  shearO(lx: number): this
  shearO(lx: number, cx: number, cy: number): this
  shearO(lx: number, cx?: number, cy?: number): this
  shearO(lx: number, cx?: number, cy = 0) {
    const { a, b, c, d, e, f } = this

    this.a = a + b * lx
    this.c = c + d * lx
    this.e = e + f * lx - cy * lx

    return this
  }

  skew(s: number): Matrix
  skew(sx: number, sy: number): Matrix
  skew(s: number, cx: number, cy: number): Matrix
  skew(sx: number, sy: number, cx: number, cy: number): Matrix
  skew(sx: number, sy?: number, cx?: number, cy?: number): Matrix
  skew(sx: number, sy?: number, cx?: number, cy?: number) {
    return this.clone().skewO(sx, sy, cx, cy)
  }

  skewO(s: number): this
  skewO(sx: number, sy: number): this
  skewO(s: number, cx: number, cy: number): this
  skewO(sx: number, sy: number, cx: number, cy: number): this
  skewO(sx: number, sy?: number, cx?: number, cy?: number): this
  skewO(sx: number, sy?: number, cx?: number, cy?: number) {
    if (typeof cy === 'undefined') {
      if (typeof cx === 'undefined') {
        cx = 0 // eslint-disable-line
        cy = 0 // eslint-disable-line
        if (typeof sy === 'undefined') {
          sy = sx // eslint-disable-line
        }
      } else {
        cy = cx // eslint-disable-line
        cx = sy // eslint-disable-line
        sy = sx // eslint-disable-line
      }
    }
    sx = Num.radians(sx) // eslint-disable-line
    sy = Num.radians(sy as number) // eslint-disable-line

    const lx = Math.tan(sx)
    const ly = Math.tan(sy)

    const { a, b, c, d, e, f } = this

    this.a = a + b * lx
    this.b = b + a * ly
    this.c = c + d * lx
    this.d = d + c * ly
    this.e = e + f * lx - cy * lx
    this.f = f + e * ly - (cx as number) * ly

    return this
  }

  skewX(x: number): Matrix
  skewX(x: number, cx: number, cy: number): Matrix
  skewX(x: number, cx?: number, cy?: number) {
    return this.skew(x, 0, cx, cy)
  }

  skewY(y: number): Matrix
  skewY(y: number, cx: number, cy: number): Matrix
  skewY(y: number, cx?: number, cy?: number) {
    return this.skew(0, y, cx, cy)
  }

  transform(o: Matrix.MatrixLike | Matrix.TransformOptions) {
    if (Matrix.isMatrixLike(o)) {
      const matrix = new Matrix(o)
      return matrix.multiplyO(this)
    }

    // Get the proposed transformations and the current transformations
    const ts = Matrix.formatTransforms(o)
    const { x: ox, y: oy } = Matrix.transformPoint(ts.ox, ts.oy, this)

    // Construct the resulting matrix
    const transformer = new Matrix()
      .translateO(ts.rx, ts.ry)
      .lmultiplyO(this)
      .translateO(-ox, -oy)
      .scaleO(ts.scaleX, ts.scaleY)
      .skewO(ts.skewX, ts.skewY)
      .shearO(ts.shear)
      .rotateO(ts.theta)
      .translateO(ox, oy)

    // If we want the origin at a particular place, we force it there
    if (Number.isFinite(ts.px) || Number.isFinite(ts.py)) {
      const origin = Matrix.transformPoint(ox, oy, transformer)
      // Doesnt work because t.px is also 0 if it wasnt passed
      const dx = Number.isFinite(ts.px) ? ts.px - origin.x : 0
      const dy = Number.isFinite(ts.py) ? ts.py - origin.y : 0
      transformer.translateO(dx, dy)
    }

    // Translate now after positioning
    transformer.translateO(ts.tx, ts.ty)
    return transformer
  }

  translate(x?: number, y?: number) {
    return this.clone().translateO(x, y)
  }

  translateO(x?: number, y?: number) {
    this.e += x || 0
    this.f += y || 0
    return this
  }

  toArray() {
    return [this.a, this.b, this.c, this.d, this.e, this.f]
  }

  toString() {
    return `matrix(${this.a},${this.b},${this.c},${this.d},${this.e},${this.f})`
  }

  valueOf(): Matrix.MatrixLike {
    return {
      a: this.a,
      b: this.b,
      c: this.c,
      d: this.d,
      e: this.e,
      f: this.f,
    }
  }
}

export namespace Matrix {
  export interface Matrixifiable {
    matrixify(): Matrix
  }
}

export namespace Matrix {
  export interface TransformOptions {
    flip?: 'both' | 'x' | 'y' | boolean
    skew?: number | [number, number]
    skewX?: number
    skewY?: number
    scale?: number | [number, number]
    scaleX?: number
    scaleY?: number
    shear?: number

    rotate?: number
    theta?: number

    ox?: number
    oy?: number
    around?: number
    origin?: number | [number, number] | { x: number; y: number }
    originX?: number
    originY?: number

    px?: number
    py?: number
    position?: number | [number, number]
    positionX?: number
    positionY?: number

    tx?: number
    ty?: number
    translate?: number | [number, number]
    translateX?: number
    translateY?: number

    rx?: number
    ry?: number
    relative?: number | [number, number]
    relativeX?: number
    relativeY?: number
  }

  export type Transform = ReturnType<typeof Matrix.prototype.decompose>

  export function formatTransforms(o: TransformOptions) {
    const flipBoth = o.flip === 'both' || o.flip === true
    const flipX = o.flip && (flipBoth || o.flip === 'x') ? -1 : 1
    const flipY = o.flip && (flipBoth || o.flip === 'y') ? -1 : 1
    const skewX =
      o.skew && Array.isArray(o.skew)
        ? o.skew[0]
        : o.skew != null && Number.isFinite(o.skew)
        ? o.skew
        : o.skewX != null && Number.isFinite(o.skewX)
        ? o.skewX
        : 0
    const skewY =
      o.skew && Array.isArray(o.skew)
        ? o.skew[1]
        : o.skew != null && Number.isFinite(o.skew)
        ? o.skew
        : o.skewY != null && Number.isFinite(o.skewY)
        ? o.skewY
        : 0
    const scaleX =
      o.scale && Array.isArray(o.scale)
        ? o.scale[0] * flipX
        : o.scale != null && Number.isFinite(o.scale)
        ? o.scale * flipX
        : o.scaleX != null && Number.isFinite(o.scaleX)
        ? o.scaleX * flipX
        : flipX
    const scaleY =
      o.scale && Array.isArray(o.scale)
        ? o.scale[1] * flipY
        : o.scale != null && Number.isFinite(o.scale)
        ? o.scale * flipY
        : o.scaleY != null && Number.isFinite(o.scaleY)
        ? o.scaleY * flipY
        : flipY

    const shear = o.shear || 0
    const theta = o.rotate || o.theta || 0
    const origin = Matrix.normalizePoint(
      o.origin || o.around || o.ox || o.originX,
      o.oy || o.originY,
    )
    const ox = origin.x
    const oy = origin.y

    // We need Point to be invalid if nothing was passed because we cannot default to 0 here. Thats why NaN
    const position = Matrix.normalizePoint(
      o.position || o.px || o.positionX || Number.NaN,
      o.py || o.positionY || Number.NaN,
    )
    const px = position.x
    const py = position.y

    const translate = Matrix.normalizePoint(
      o.translate || o.tx || o.translateX,
      o.ty || o.translateY,
    )
    const tx = translate.x
    const ty = translate.y
    const relative = Matrix.normalizePoint(
      o.relative || o.rx || o.relativeX,
      o.ry || o.relativeY,
    )
    const rx = relative.x
    const ry = relative.y

    return {
      scaleX,
      scaleY,
      skewX,
      skewY,
      shear,
      theta,
      rx,
      ry,
      tx,
      ty,
      ox,
      oy,
      px,
      py,
    }
  }

  export interface MatrixLike {
    a: number
    b: number
    c: number
    d: number
    e: number
    f: number
  }

  export function isMatrixLike(o: any): o is MatrixLike {
    return (
      typeof o === 'object' &&
      typeof o.a === 'number' &&
      typeof o.b === 'number' &&
      typeof o.c === 'number' &&
      typeof o.d === 'number' &&
      typeof o.e === 'number' &&
      typeof o.f === 'number'
    )
  }

  export type MatrixArray = [number, number, number, number, number, number]

  export function toMatrixLike(a: MatrixArray): MatrixLike {
    return {
      a: a[0],
      b: a[1],
      c: a[2],
      d: a[3],
      e: a[4],
      f: a[5],
    }
  }

  export type Raw =
    | string
    | Matrix.Matrixifiable
    | MatrixLike
    | MatrixArray
    | TransformOptions

  export function multiply(l: Matrix, r: Matrix, o: Matrix) {
    const a = l.a * r.a + l.c * r.b
    const b = l.b * r.a + l.d * r.b
    const c = l.a * r.c + l.c * r.d
    const d = l.b * r.c + l.d * r.d
    const e = l.e + l.a * r.e + l.c * r.f
    const f = l.f + l.b * r.e + l.d * r.f

    o.a = a
    o.b = b
    o.c = c
    o.d = d
    o.e = e
    o.f = f

    return o
  }

  export function transformPoint(x: number, y: number, matrix: Raw) {
    const m = isMatrixLike(matrix) ? matrix : new Matrix(matrix)

    return {
      x: m.a * x + m.c * y + m.e,
      y: m.b * x + m.d * y + m.f,
    }
  }

  export function normalizePoint(
    x?: number | { x: number; y: number } | [number, number],
    y?: number,
  ) {
    const source = Array.isArray(x)
      ? { x: x[0], y: x[1] }
      : typeof x === 'object'
      ? { x: x.x, y: x.y }
      : { x, y }
    return {
      x: source.x == null ? 0 : source.x,
      y: source.y == null ? 0 : source.y,
    }
  }
}
