import { Dom } from '@antv/x6-common'
import { Point, Rectangle } from '@antv/x6-geometry'
import { Util } from '@antv/x6-core'
import { Base } from './base'

// client: window
// page: document
// local: stage
// graph: svg
export class CoordManager extends Base {
  getLocalMatrix() {
    return Dom.createSVGMatrix(this.view.stage.getScreenCTM())
  }

  /**
   * Returns coordinates of the graph viewport, relative to the window.
   */
  getGraphOffset() {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    const rect = this.view.svg.getBoundingClientRect()
    return new Point(rect.left, rect.top)
  }

  /**
   * Returns coordinates of the graph viewport, relative to the document.
   */
  getPageOffset() {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    return this.getGraphOffset().translate(window.scrollX, window.scrollY)
  }

  snapToGrid(x: number | Point | Point.PointLike, y?: number) {
    const p =
      typeof x === 'number'
        ? this.clientToLocalPoint(x, y as number)
        : this.clientToLocalPoint(x.x, x.y)
    return p.snapToGrid(this.graph.getGridSize())
  }

  localToGraphPoint(x: number | Point | Point.PointLike, y?: number) {
    const localPoint = Point.create(x, y)
    return Util.transformPoint(localPoint, this.graph.matrix())
  }

  localToClientPoint(x: number | Point | Point.PointLike, y?: number) {
    const localPoint = Point.create(x, y)
    return Util.transformPoint(localPoint, this.getLocalMatrix())
  }

  localToPagePoint(x: number | Point | Point.PointLike, y?: number) {
    const p =
      typeof x === 'number'
        ? this.localToGraphPoint(x, y!)
        : this.localToGraphPoint(x)
    return p.translate(this.getPageOffset())
  }

  localToGraphRect(
    x: number | Rectangle | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    const localRect = Rectangle.create(x, y, width, height)
    return Util.transformRectangle(localRect, this.graph.matrix())
  }

  localToClientRect(
    x: number | Rectangle | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    const localRect = Rectangle.create(x, y, width, height)
    return Util.transformRectangle(localRect, this.getLocalMatrix())
  }

  localToPageRect(
    x: number | Rectangle | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    const rect =
      typeof x === 'number'
        ? this.localToGraphRect(x, y!, width!, height!)
        : this.localToGraphRect(x)
    return rect.translate(this.getPageOffset())
  }

  graphToLocalPoint(x: number | Point | Point.PointLike, y?: number) {
    const graphPoint = Point.create(x, y)
    return Util.transformPoint(graphPoint, this.graph.matrix().inverse())
  }

  clientToLocalPoint(x: number | Point | Point.PointLike, y?: number) {
    const clientPoint = Point.create(x, y)
    return Util.transformPoint(clientPoint, this.getLocalMatrix().inverse())
  }

  clientToGraphPoint(x: number | Point | Point.PointLike, y?: number) {
    const clientPoint = Point.create(x, y)
    return Util.transformPoint(
      clientPoint,
      this.graph.matrix().multiply(this.getLocalMatrix().inverse()),
    )
  }

  pageToLocalPoint(x: number | Point | Point.PointLike, y?: number) {
    const pagePoint = Point.create(x, y)
    const graphPoint = pagePoint.diff(this.getPageOffset())
    return this.graphToLocalPoint(graphPoint)
  }

  graphToLocalRect(
    x: number | Rectangle | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    const graphRect = Rectangle.create(x, y, width, height)
    return Util.transformRectangle(graphRect, this.graph.matrix().inverse())
  }

  clientToLocalRect(
    x: number | Rectangle | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    const clientRect = Rectangle.create(x, y, width, height)
    return Util.transformRectangle(clientRect, this.getLocalMatrix().inverse())
  }

  clientToGraphRect(
    x: number | Rectangle | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    const clientRect = Rectangle.create(x, y, width, height)
    return Util.transformRectangle(
      clientRect,
      this.graph.matrix().multiply(this.getLocalMatrix().inverse()),
    )
  }

  pageToLocalRect(
    x: number | Rectangle | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    const graphRect = Rectangle.create(x, y, width, height)
    const pageOffset = this.getPageOffset()
    graphRect.x -= pageOffset.x
    graphRect.y -= pageOffset.y
    return this.graphToLocalRect(graphRect)
  }
}

export namespace CoordManager {}
