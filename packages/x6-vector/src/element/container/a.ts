import { Attrs } from '../../types'
import { DomUtil } from '../../util/dom'
import { GeometryContainer } from './container-geometry'

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
    return this.attr('href', url, DomUtil.namespaces.xlink)
  }
}

export namespace A {
  export function create(): A
  export function create(attrs: Attrs): A
  export function create(url: string, attrs?: Attrs | null): A
  export function create(url?: string | Attrs | null, attrs?: Attrs | null): A
  export function create(url?: string | Attrs | null, attrs?: Attrs | null) {
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
