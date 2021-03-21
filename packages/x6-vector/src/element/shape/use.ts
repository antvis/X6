import { DomUtil } from '../../util/dom'
import { Attrs } from '../../types'
import { Shape } from './shape'

@Use.register('Use')
export class Use extends Shape<SVGUseElement> {
  use(elementId: string, file?: string) {
    return this.attr(
      'href',
      `${file || ''}#${elementId}`,
      DomUtil.namespaces.xlink,
    )
  }
}

export namespace Use {
  export function create(attrs?: Attrs | null): Use
  export function create(elementId: string, attrs?: Attrs | null): Use
  export function create(
    elementId: string,
    file: string,
    attrs?: Attrs | null,
  ): Use
  export function create(
    elementId?: string | Attrs | null,
    file?: string | Attrs | null,
    attrs?: Attrs | null,
  ): Use
  export function create(
    elementId?: string | Attrs | null,
    file?: string | Attrs | null,
    attrs?: Attrs | null,
  ) {
    const use = new Use()
    if (elementId) {
      if (typeof elementId === 'string') {
        if (file) {
          if (typeof file === 'string') {
            use.use(elementId, file)
            if (attrs) {
              use.attr(attrs)
            }
          } else {
            use.use(elementId).attr(file)
          }
        } else {
          use.use(elementId)
          if (attrs) {
            use.attr(attrs)
          }
        }
      } else {
        use.attr(elementId)
      }
    }
    return use
  }
}
