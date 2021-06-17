import { FEBase } from '../fe-base/fe-base'
import { SVGFEImageAttributes } from './types'

@FEImage.register('FeImage')
export class FEImage extends FEBase<SVGFEImageElement> {
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
