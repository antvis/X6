import { Shape } from '../common/shape'
import { SVGUseAttributes } from './types'

@Use.register('Use')
export class Use extends Shape<SVGUseElement> {
  use(elementId: string, file?: string) {
    return this.attr('href', `${file || ''}#${elementId}`)
  }
}

export namespace Use {
  export function create<Attributes extends SVGUseAttributes>(
    attrs?: Attributes | null,
  ): Use
  export function create<Attributes extends SVGUseAttributes>(
    elementId: string,
    attrs?: Attributes | null,
  ): Use
  export function create<Attributes extends SVGUseAttributes>(
    elementId: string,
    file: string,
    attrs?: Attributes | null,
  ): Use
  export function create<Attributes extends SVGUseAttributes>(
    elementId?: string | Attributes | null,
    file?: string | Attributes | null,
    attrs?: Attributes | null,
  ): Use
  export function create<Attributes extends SVGUseAttributes>(
    elementId?: string | Attributes | null,
    file?: string | Attributes | null,
    attrs?: Attributes | null,
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
