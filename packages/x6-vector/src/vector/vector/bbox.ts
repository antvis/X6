import { withSvgContext } from '../../util'
import { Box } from '../../struct/box'
import { Base } from '../common/base'
import { Transform } from './transform'

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
    return rbox.addOffset()
  }

  inside(x: number, y: number) {
    const box = this.bbox()
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
