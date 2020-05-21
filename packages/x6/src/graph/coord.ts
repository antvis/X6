import { Base } from './base'
import { Dom } from '../util'
import { Point, Rectangle } from '../geometry'

export class CoordManager extends Base {
  getClientMatrix() {
    return Dom.createSVGMatrix(this.view.stage.getScreenCTM())
  }

  /**
   * Returns coordinates of the graph viewport, relative to the window.
   */
  getClientOffset() {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    const rect = this.view.svg.getBoundingClientRect()
    return new Point(rect.left, rect.top)
  }

  /**
   * Returns coordinates of the graph viewport, relative to the document.
   */
  getPageOffset() {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    return this.getClientOffset().translate(window.scrollX, window.scrollY)
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
    return Dom.transformPoint(localPoint, this.graph.matrix())
  }

  localToClientPoint(x: number | Point | Point.PointLike, y?: number) {
    const localPoint = Point.create(x, y)
    return Dom.transformPoint(localPoint, this.getClientMatrix())
  }

  localToPagePoint(x: number | Point | Point.PointLike, y?: number) {
    const p =
      typeof x === 'number'
        ? this.localToGraphPoint(x, y!)
        : this.localToGraphPoint(x)
    return p.translate(this.getPageOffset())
  }

  localToPaperRect(
    x: number | Rectangle | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    const localRect = Rectangle.create(x, y, width, height)
    return Dom.transformRectangle(localRect, this.graph.matrix())
  }

  localToClientRect(
    x: number | Rectangle | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    const localRect = Rectangle.create(x, y, width, height)
    const clientRect = Dom.transformRectangle(localRect, this.getClientMatrix())
    return clientRect
  }

  localToPageRect(
    x: number | Rectangle | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    const rect =
      typeof x === 'number'
        ? this.localToPaperRect(x, y!, width!, height!)
        : this.localToPaperRect(x)
    return rect.translate(this.getPageOffset())
  }

  graphToLocalPoint(x: number | Point | Point.PointLike, y?: number) {
    const paperPoint = Point.create(x, y)
    return Dom.transformPoint(paperPoint, this.graph.matrix().inverse())
  }

  clientToLocalPoint(x: number | Point | Point.PointLike, y?: number) {
    const clientPoint = Point.create(x, y)
    return Dom.transformPoint(clientPoint, this.getClientMatrix().inverse())
  }

  pageToLocalPoint(x: number | Point | Point.PointLike, y?: number) {
    const pagePoint = Point.create(x, y)
    const paperPoint = pagePoint.diff(this.getPageOffset())
    return this.graphToLocalPoint(paperPoint)
  }

  graphToLocalRect(
    x: number | Rectangle | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    const paperRect = Rectangle.create(x, y, width, height)
    return Dom.transformRectangle(paperRect, this.graph.matrix().inverse())
  }

  clientToLocalRect(
    x: number | Rectangle | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    const clientRect = Rectangle.create(x, y, width, height)
    return Dom.transformRectangle(clientRect, this.getClientMatrix().inverse())
  }

  pageToLocalRect(
    x: number | Rectangle | Rectangle.RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    const paperRect = Rectangle.create(x, y, width, height)
    const pageOffset = this.getPageOffset()
    paperRect.x -= pageOffset.x
    paperRect.y -= pageOffset.y
    return this.graphToLocalRect(paperRect)
  }
}
