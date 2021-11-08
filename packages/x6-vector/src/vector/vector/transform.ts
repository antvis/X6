import { Matrix } from '../../struct/matrix'
import { Point } from '../../struct/point'
import { Base } from '../common/base'
import type { SVG } from '../svg/svg'

export class Transform<
  TSVGElement extends SVGElement = SVGElement,
> extends Base<TSVGElement> {
  /**
   * Moves an element to a different parent (similar to addTo), but without
   * changing its visual representation. All transformations are merged and
   * applied to the element.
   */
  toParent(parent: Transform, index?: number): this {
    if (this !== parent) {
      const ctm = this.screenCTM()
      const pCtm = parent.screenCTM().inverse()

      this.addTo(parent, index).untransform().transform(pCtm.multiply(ctm))
    }

    return this
  }

  /**
   * Moves an element to the root svg (similar to addTo), but without
   * changing its visual representation. All transformations are merged and
   * applied to the element.
   */
  toRoot(index?: number): this {
    const root = this.root()
    if (root) {
      return this.toParent(root, index)
    }
    return this
  }

  /**
   * Transforms a point from screen coordinates to the elements coordinate system.
   */
  toLocalPoint(p: Point.PointLike): Point
  toLocalPoint(x: number, y: number): Point
  toLocalPoint(x: number | Point.PointLike, y?: number) {
    const p = typeof x === 'number' ? new Point(x, y) : new Point(x)
    return p.transform(this.screenCTM().inverse())
  }

  ctm() {
    const node = this.node as any as SVGGraphicsElement
    return new Matrix(node.getCTM())
  }

  screenCTM() {
    /* https://bugzilla.mozilla.org/show_bug.cgi?id=1344537
     This is needed because FF does not return the transformation matrix
     for the inner coordinate system when getScreenCTM() is called on nested svgs.
     However all other Browsers do that */
    const svg = this as any as SVG
    if (typeof svg.isRoot === 'function' && !svg.isRoot()) {
      const rect = svg.rect(1, 1)
      const m = rect.node.getScreenCTM()
      rect.remove()
      return new Matrix(m)
    }

    const node = this.node as any as SVGGraphicsElement
    return new Matrix(node.getScreenCTM())
  }
}
