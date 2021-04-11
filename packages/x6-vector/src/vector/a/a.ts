import { GeometryContainer } from '../container/geometry'
import { SVGAAttributes } from './types'

@A.register('A')
export class A extends GeometryContainer<SVGAElement> {
  target(): string
  target(target: '_self' | '_parent' | '_top' | '_blank' | string | null): this
  target(target?: string | null) {
    return this.attr('target', target)
  }

  to(): string
  to(url: string | null): this
  to(url?: string | null) {
    return this.attr('href', url)
  }
}

export namespace A {
  export function create(): A
  export function create<Attributes extends SVGAAttributes>(
    attrs: Attributes,
  ): A
  export function create<Attributes extends SVGAAttributes>(
    url: string,
    attrs?: Attributes | null,
  ): A
  export function create<Attributes extends SVGAAttributes>(
    url?: string | Attributes | null,
    attrs?: Attributes | null,
  ): A
  export function create<Attributes extends SVGAAttributes>(
    url?: string | Attributes | null,
    attrs?: Attributes | null,
  ) {
    const a = new A()
    if (url != null) {
      if (typeof url === 'string') {
        a.to(url)
        if (attrs) {
          a.attr(attrs)
        }
      } else if (typeof url === 'object') {
        a.attr(url)
      }
    }
    return a
  }
}
