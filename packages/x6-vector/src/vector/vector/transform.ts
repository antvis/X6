import { Matrix } from '../../struct/matrix'
import { Point } from '../../struct/point'
import type { Svg } from '../svg/svg'
import { Base } from '../common/base'

export class Transform<
  TSVGElement extends SVGElement = SVGElement
> extends Base<TSVGElement> {
  toParent(parent: Transform, index?: number): this {
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

  point(x: number, y: number) {
    return new Point(x, y).transform(this.screenCTM().inverse())
  }

  ctm() {
    const node = (this.node as any) as SVGGraphicsElement
    return new Matrix(node.getCTM())
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

    const node = (this.node as any) as SVGGraphicsElement
    return new Matrix(node.getScreenCTM())
  }
}
