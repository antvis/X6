import { Box } from '../../struct/box'
import { Point } from '../../struct/point'
import { Vector } from '../vector/vector'

export class Viewbox<
  TSVGElement extends
    | SVGSVGElement
    | SVGSymbolElement
    | SVGPatternElement
    | SVGMarkerElement
> extends Vector<TSVGElement> {
  viewbox(): Box
  viewbox(box: Box.BoxLike): this
  viewbox(
    x: number | string,
    y: number | string,
    width: number | string,
    height: number | string,
  ): this
  viewbox(
    x?: number | string | Box.BoxLike,
    y?: number | string,
    width?: number | string,
    height?: number | string,
  ) {
    if (x == null) {
      return new Box(this.attr('viewBox'))
    }

    return this.attr(
      'viewBox',
      typeof x === 'object'
        ? `${x.x} ${x.y} ${x.width} ${x.height}`
        : `${x} ${y} ${width} ${height}`,
    )
  }

  zoom(): number
  zoom(level: number, origin?: Point.PointLike): this
  zoom(level?: number, origin?: Point.PointLike) {
    let { width, height } = this.attr(['width', 'height'])

    if (
      (width == null && height == null) ||
      typeof width === 'string' ||
      typeof height === 'string'
    ) {
      width = this.node.clientWidth
      height = this.node.clientHeight
    }

    if (width == null || height == null) {
      throw new Error(
        'Impossible to get absolute width and height. ' +
          'Please provide an absolute width and height attribute on the zooming element',
      )
    }

    const w = width as number
    const h = height as number
    const v = this.viewbox()
    const zoomX = w / v.width
    const zoomY = h / v.height
    const zoom = Math.min(zoomX, zoomY)

    if (level == null) {
      return zoom
    }

    let zoomAmount = zoom / level

    // Set the zoomAmount to the highest value which is safe to process and
    // recover from.
    // The * 100 is a bit of wiggle room for the matrix transformation.
    if (zoomAmount === Number.POSITIVE_INFINITY) {
      zoomAmount = Number.MAX_SAFE_INTEGER / 100
    }

    const o = origin || {
      x: w / 2 / zoomX + v.x,
      y: h / 2 / zoomY + v.y,
    }

    const box = new Box(v).transform({ scale: zoomAmount, origin: o })

    return this.viewbox(box)
  }
}
