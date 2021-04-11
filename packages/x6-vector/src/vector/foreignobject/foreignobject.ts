import { Vector } from '../vector/vector'
import { SVGForeignObjectAttributes } from './types'

@ForeignObject.register('ForeignObject')
export class ForeignObject extends Vector<SVGForeignObjectElement> {}

export namespace ForeignObject {
  export function create<Attributes extends SVGForeignObjectAttributes>(
    attrs?: Attributes | null,
  ): ForeignObject
  export function create<Attributes extends SVGForeignObjectAttributes>(
    size: number | string,
    attrs?: Attributes | null,
  ): ForeignObject
  export function create<Attributes extends SVGForeignObjectAttributes>(
    width: number | string,
    height: number | string,
    attrs?: Attributes | null,
  ): ForeignObject
  export function create<Attributes extends SVGForeignObjectAttributes>(
    width?: number | string | Attributes | null,
    height?: number | string | Attributes | null,
    attrs?: Attributes | null,
  ): ForeignObject
  export function create<Attributes extends SVGForeignObjectAttributes>(
    width?: number | string | Attributes | null,
    height?: number | string | Attributes | null,
    attrs?: Attributes | null,
  ) {
    const fo = new ForeignObject()
    if (width == null) {
      fo.size(0, 0)
    } else if (typeof width === 'object') {
      fo.size(0, 0).attr(width)
    } else if (height != null && typeof height === 'object') {
      fo.size(width, width).attr(height)
    } else {
      if (typeof height === 'undefined') {
        fo.size(width, width)
      } else {
        fo.size(width, height)
      }

      if (attrs) {
        fo.attr(attrs)
      }
    }

    return fo
  }
}
