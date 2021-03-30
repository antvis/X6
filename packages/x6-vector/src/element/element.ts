import type { Svg } from './container/svg'
import type { Text } from './shape/text'
import type { KeyValue } from '../types'
import { DomUtil } from '../util/dom'
import { Util } from './util'
import { Box } from '../struct/box'
import { Point } from '../struct/point'
import { Color } from '../struct/color'
import { Matrix } from '../struct/matrix'
import { UNumber } from '../struct/unumber'
import { Vector } from './vector'

@VectorElement.register('Element')
export class VectorElement<TSVGElement extends SVGElement = SVGElement>
  extends Vector<TSVGElement>
  implements Matrix.Matrixifiable {
  width(): number
  width(width: string | number | null): this
  width(width?: string | number | null) {
    return this.attr<number>('width', width)
  }

  height(): number
  height(height: string | number | null): this
  height(height?: string | number | null) {
    return this.attr<number>('height', height)
  }

  size(width: string | number, height: string | number): this
  size(width: string | number, height: string | number | null | undefined): this
  size(width: string | number | null | undefined, height: string | number): this
  size(width?: string | number | null, height?: string | number | null) {
    const bbox = Util.proportionalSize(this, width, height)
    return this.width(bbox.width).height(bbox.height)
  }

  x(): number
  x(x: string | number | null): this
  x(x?: string | number | null) {
    return this.attr<number>('x', x)
  }

  y(): number
  y(y: string | number | null): this
  y(y?: string | number | null) {
    return this.attr<number>('y', y)
  }

  move(x: string | number = 0, y: string | number = 0) {
    return this.x(x).y(y)
  }

  cx(): number
  cx(x: null): number
  cx(x: string | number): this
  cx(x?: string | number | null) {
    return x == null
      ? this.x() + this.width() / 2
      : this.x(UNumber.minus(x, this.width() / 2))
  }

  cy(): number
  cy(y: null): number
  cy(y: string | number | null): this
  cy(y?: string | number | null) {
    return y == null
      ? this.y() + this.height() / 2
      : this.y(UNumber.minus(y, this.height() / 2))
  }

  center(x: string | number, y: string | number) {
    return this.cx(x).cy(y)
  }

  dx(x: string | number) {
    return this.x(UNumber.plus(x, this.x()))
  }

  dy(y: string | number) {
    return this.y(UNumber.plus(y, this.y()))
  }

  dmove(x: string | number = 0, y: string | number = 0) {
    return this.dx(x).dy(y)
  }

  // #region Fill and Stroke

  fill(): string
  fill(color: string | Color | Color.RGBA | VectorElement | null): this
  fill(attrs: {
    color?: string
    opacity?: number
    rule?: 'nonzero' | 'evenodd'
  }): this
  fill(
    value?:
      | null
      | string
      | Color
      | Color.RGBA
      | VectorElement
      | {
          color?: string
          opacity?: number
          rule?: 'nonzero' | 'evenodd'
        },
  ) {
    if (typeof value === 'undefined') {
      return this.attr('fill')
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    Private.fillOrStroke(this, 'fill', value, ['color', 'opacity', 'rule'])
    return this
  }

  stroke(): string
  stroke(color: string | Color | Color.RGBA | VectorElement | null): this
  stroke(attrs: {
    color?: string
    width?: number
    opacity?: number
    linecap?: 'butt' | 'round' | 'square'
    linejoin?: 'arcs' | 'bevel' | 'miter' | 'miter-clip' | 'round'
    miterlimit?: number
    dasharray?: string
    dashoffset?: string
  }): this
  stroke(
    value?:
      | null
      | string
      | Color
      | Color.RGBA
      | VectorElement
      | {
          color?: string
          width?: number
          opacity?: number
          linecap?: 'butt' | 'round' | 'square'
          linejoin?: 'arcs' | 'bevel' | 'miter' | 'miter-clip' | 'round'
          miterlimit?: number
          dasharray?: string
          dashoffset?: string
        },
  ) {
    if (typeof value === 'undefined') {
      return this.attr('stroke')
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    Private.fillOrStroke(this, 'fill', value, [
      'color',
      'width',
      'opacity',
      'linecap',
      'linejoin',
      'miterlimit',
      'dasharray',
      'dashoffset',
    ])
    return this
  }

  opacity(): number
  opacity(value: number | null): this
  opacity(value?: number | null) {
    return this.attr<number>('opacity', value)
  }

  // #endregion

  // #region Font

  font(attrs: KeyValue<string | number>): this
  font(key: string, value: string | number): this
  font(a: KeyValue<string | number> | string, v?: string | number) {
    if (typeof a === 'object') {
      Object.keys(a).forEach((key) => this.font(key, a[key]))
      return this
    }

    if (a === 'leading') {
      const text = (this as any) as Text // eslint-disable-line
      if (text.leading) {
        text.leading(v)
      }
      return this
    }

    return a === 'anchor'
      ? this.attr('text-anchor', v)
      : a === 'size' ||
        a === 'family' ||
        a === 'weight' ||
        a === 'stretch' ||
        a === 'variant' ||
        a === 'style'
      ? this.attr(`font-${a}`, v)
      : this.attr(a, v)
  }

  // #endregion

  // #region Transform

  transform(): Matrix.Transform
  transform(type: keyof Matrix.Transform): number
  transform(
    options: Matrix.TransformOptions,
    relative?: boolean | VectorElement | Matrix.Raw,
  ): this
  transform(
    matrix: Matrix.MatrixLike,
    relative?: boolean | VectorElement | Matrix.Raw,
  ): this
  transform(
    o?: keyof Matrix.Transform | Matrix.MatrixLike | Matrix.TransformOptions,
    relative?: boolean | VectorElement | Matrix.Raw,
  ) {
    if (o == null || typeof o === 'string') {
      const decomposed = new Matrix(this).decompose()
      return o == null ? decomposed : decomposed[o]
    }

    const m = Matrix.isMatrixLike(o)
      ? o
      : {
          ...o,
          origin: Private.getOrigin(o, this),
        }

    // The user can pass a boolean, an Element or an Matrix or nothing
    const raw = relative === true ? this : relative || undefined
    const res = new Matrix(raw).transform(m)
    return this.attr('transform', res.toString())
  }

  untransform() {
    return this.attr('transform', null)
  }

  matrixify(): Matrix {
    const raw = this.attr('transform') || ''
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

  toParent(parent: VectorElement, index?: number): this {
    if (this !== parent) {
      const ctm = this.screenCTM()
      const pCtm = parent.screenCTM().inverse()

      this.addTo(parent, index).untransform().transform(pCtm.multiply(ctm))
    }

    return this
  }

  toRoot(index?: number): this {
    const root = this.root()
    if (root) {
      return this.toParent(root, index)
    }
    return this
  }

  ctm() {
    return new Matrix(DomUtil.toElement<SVGGraphicsElement>(this.node).getCTM())
  }

  screenCTM() {
    /* https://bugzilla.mozilla.org/show_bug.cgi?id=1344537
     This is needed because FF does not return the transformation matrix
     for the inner coordinate system when getScreenCTM() is called on nested svgs.
     However all other Browsers do that */
    const svg = (this as any) as Svg
    if (typeof svg.isRoot === 'function' && !svg.isRoot()) {
      const rect = svg.rect(1, 1)
      const m = rect.node.getScreenCTM()
      rect.remove()
      return new Matrix(m)
    }
    return new Matrix(
      DomUtil.toElement<SVGGraphicsElement>(this.node).getScreenCTM(),
    )
  }

  point(x: number, y: number) {
    return new Point(x, y).transform(this.screenCTM().inverse())
  }

  matrix(): Matrix
  matrix(a: number, b: number, c: number, d: number, e: number, f: number): this
  matrix(
    a?: number,
    b?: number,
    c?: number,
    d?: number,
    e?: number,
    f?: number,
  ) {
    if (a == null) {
      return new Matrix(this)
    }

    return this.attr(
      'transform',
      new Matrix(
        a,
        b as number,
        c as number,
        d as number,
        e as number,
        f as number,
      ).toString(),
    )
  }

  rotate(angle: number, cx?: number, cy?: number) {
    return this.transform({ rotate: angle, ox: cx, oy: cy }, true)
  }

  skew(x: number, y: number, cx?: number, cy?: number) {
    return arguments.length === 1 || arguments.length === 3
      ? this.transform({ skew: x, ox: y, oy: cx }, true)
      : this.transform({ skew: [x, y], ox: cx, oy: cy }, true)
  }

  shear(lam: number, cx?: number, cy?: number) {
    return this.transform({ shear: lam, ox: cx, oy: cy }, true)
  }

  scale(x: number, y: number, cx?: number, cy?: number) {
    return arguments.length === 1 || arguments.length === 3
      ? this.transform({ scale: x, ox: y, oy: cx }, true)
      : this.transform({ scale: [x, y], ox: cx, oy: cy }, true)
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
    origin?: number | [number, number] | Point.PointLike,
  ): this
  flip(
    direction:
      | 'both'
      | 'x'
      | 'y'
      | number
      | [number, number]
      | Point.PointLike = 'both',
    origin?: number | [number, number] | Point.PointLike,
  ) {
    if (typeof direction !== 'string') {
      origin = direction // eslint-disable-line
      direction = 'both' // eslint-disable-line
    }

    return this.transform({ origin, flip: direction }, true)
  }

  // #endregion

  // #region BBox

  bbox() {
    const getBBox = (node: SVGGraphicsElement) => node.getBBox()
    const retry = (node: SVGGraphicsElement) =>
      DomUtil.withSvgContext((svg) => {
        try {
          const cloned = this.clone<VectorElement>().addTo(svg).show()
          const box = DomUtil.toElement<SVGGraphicsElement>(
            cloned.node,
          ).getBBox()
          cloned.remove()
          return box
        } catch (error) {
          throw new Error(
            `Getting bbox of element "${
              node.nodeName
            }" is not possible: ${error.toString()}`,
          )
        }
      })

    const box = DomUtil.getBox(
      DomUtil.toElement<SVGGraphicsElement>(this.node),
      getBBox,
      retry,
    )
    return new Box(box)
  }

  rbox(elem?: VectorElement) {
    const getRBox = (node: SVGGraphicsElement) => node.getBoundingClientRect()
    const retry = (node: SVGGraphicsElement) => {
      // There is no point in trying tricks here because if we insert the
      // element into the dom ourselfes it obviously will be at the wrong position
      throw new Error(
        `Getting rbox of element "${node.nodeName}" is not possible`,
      )
    }

    const box = DomUtil.getBox(
      DomUtil.toElement<SVGGraphicsElement>(this.node),
      getRBox,
      retry,
    )

    const rbox = new Box(box)

    // If an element was passed, return the bbox in the coordinate system of
    // that element.
    if (elem) {
      return rbox.transform(elem.screenCTM().inverseO())
    }

    // Else we want it in absolute screen coordinates
    // Therefore we need to add the scrollOffset
    return rbox.addOffset()
  }

  inside(x: number, y: number) {
    const box = this.bbox()
    return (
      x > box.x && y > box.y && x < box.x + box.width && y < box.y + box.height
    )
  }

  // #endregion
}

namespace Private {
  export function fillOrStroke(
    elem: VectorElement,
    type: 'fill' | 'stroke',
    value: string | Color | VectorElement | KeyValue | null,
    names: string[],
  ) {
    if (value === null) {
      elem.attr(type, null)
    } else if (
      typeof value === 'string' ||
      value instanceof Color ||
      Color.isRgbLike(value) ||
      value instanceof VectorElement
    ) {
      elem.attr(type, value.toString())
    } else {
      const prefix = (t: string, a: string) => (a === 'color' ? t : `${t}-${a}`)
      for (let i = names.length - 1; i >= 0; i -= 1) {
        const k = names[i]
        const v = value[k]
        if (v != null) {
          elem.attr(prefix(type, k), v)
        }
      }
    }
  }

  /**
   * This function adds support for string origins.
   * It searches for an origin in o.origin o.ox and o.originX.
   * This way, origin: {x: 'center', y: 50} can be passed as well as ox: 'center', oy: 50
   * */
  export function getOrigin(
    o: Matrix.TransformOptions,
    element: VectorElement,
  ): [number, number] {
    const { origin } = o
    // First check if origin is in ox or originX
    let ox = o.ox != null ? o.ox : o.originX != null ? o.originX : 'center'
    let oy = o.oy != null ? o.oy : o.originY != null ? o.originY : 'center'

    // Then check if origin was used and overwrite in that case
    if (origin != null) {
      ;[ox, oy] = Array.isArray(origin)
        ? origin
        : typeof origin === 'object'
        ? [origin.x, origin.y]
        : [origin, origin]
    }

    // Make sure to only call bbox when actually needed
    if (typeof ox === 'string' || typeof oy === 'string') {
      const { height, width, x, y } = element.bbox()

      // And only overwrite if string was passed for this specific axis
      if (typeof ox === 'string') {
        ox = ox.includes('left')
          ? x
          : ox.includes('right')
          ? x + width
          : x + width / 2
      }

      if (typeof oy === 'string') {
        oy = oy.includes('top')
          ? y
          : oy.includes('bottom')
          ? y + height
          : y + height / 2
      }
    }

    return [ox, oy]
  }
}
