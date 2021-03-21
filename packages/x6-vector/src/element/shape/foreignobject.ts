import { Attrs } from '../../types'
import { VectorElement } from '../element'

@ForeignObject.register('ForeignObject')
export class ForeignObject extends VectorElement<SVGForeignObjectElement> {}

export namespace ForeignObject {
  export function create(attrs?: Attrs | null): ForeignObject
  export function create(
    size: number | string,
    attrs?: Attrs | null,
  ): ForeignObject
  export function create(
    width: number | string,
    height: number | string,
    attrs?: Attrs | null,
  ): ForeignObject
  export function create(
    width?: number | string | Attrs | null,
    height?: number | string | Attrs | null,
    attrs?: Attrs | null,
  ): ForeignObject
  export function create(
    width?: number | string | Attrs | null,
    height?: number | string | Attrs | null,
    attrs?: Attrs | null,
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
