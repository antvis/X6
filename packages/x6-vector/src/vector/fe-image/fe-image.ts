import { FeBase } from '../fe-base/fe-base'
import { SVGFEImageAttributes } from './types'

@FEImage.register('FEImage')
export class FEImage extends FeBase<SVGFEImageElement> {
  preserveAspectRatio(): string
  preserveAspectRatio(v: string | null): this
  preserveAspectRatio(v?: string | null) {
    return this.attr('preserveAspectRatio', v)
  }

  href(): string
  href(url: string | null): this
  href(url?: string | null) {
    return this.attr('xlink:href', url)
  }
}

export namespace FEImage {
  export function create<Attributes extends SVGFEImageAttributes>(
    attrs?: Attributes | null,
  ) {
    const elem = new FEImage()
    if (attrs) {
      elem.attr(attrs)
    }
    return elem
  }
}
