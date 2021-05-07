import { withSvgContext } from '../../util/context'
import { Box } from '../../struct/box'
import { Base } from '../common/base'
import { Transform } from './transform'
import { Global } from '../../global'
import { Point } from '../../struct/point'

export class BBox<
  TSVGElement extends SVGElement = SVGElement
> extends Base<TSVGElement> {
  bbox() {
    const getBBox = (node: SVGGraphicsElement) => node.getBBox()
    const retry = (node: SVGGraphicsElement) =>
      withSvgContext((svg) => {
        try {
          const cloned = this.clone().addTo(svg).show()
          const elem = cloned.node as SVGGraphicsElement
          const box = elem.getBBox()
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

    const box = BBox.getBox(this, getBBox, retry)
    return new Box(box)
  }

  rbox<T extends Transform>(elem?: T) {
    const getRBox = (node: SVGGraphicsElement) => node.getBoundingClientRect()
    const retry = (node: SVGGraphicsElement) => {
      // There is no point in trying tricks here because if we insert the
      // element into the dom ourselfes it obviously will be at the wrong position
      throw new Error(
        `Getting rbox of element "${node.nodeName}" is not possible`,
      )
    }

    const box = BBox.getBox(this, getRBox, retry)
    const rbox = new Box(box)

    // If an element was passed, return the bbox in the coordinate system of
    // that element.
    if (elem) {
      return rbox.transform(elem.screenCTM().inverseO())
    }

    // Else we want it in absolute screen coordinates
    // Therefore we need to add the scrollOffset
    rbox.x += Global.window.pageXOffset
    rbox.y += Global.window.pageYOffset

    return rbox
  }

  containsPoint(p: Point.PointLike): boolean
  containsPoint(x: number, y: number): boolean
  containsPoint(arg1: number | Point.PointLike, arg2?: number) {
    const box = this.bbox()
    const x = typeof arg1 === 'number' ? arg1 : arg1.x
    const y = typeof arg1 === 'number' ? (arg2 as number) : arg1.y
    return (
      x > box.x && y > box.y && x < box.x + box.width && y < box.y + box.height
    )
  }
}

export namespace BBox {
  export function getBox<T extends Base<SVGElement>>(
    elem: T,
    getBBox: (node: SVGGraphicsElement) => DOMRect,
    retry: (node: SVGGraphicsElement) => DOMRect,
  ) {
    const node = elem.node as SVGGraphicsElement
    let box
    try {
      box = getBBox(node)
      if (Box.isNull(box) && !elem.isInDocument()) {
        throw new Error('Element not in the dom')
      }
    } catch {
      box = retry(node)
    }

    return box
  }
}
