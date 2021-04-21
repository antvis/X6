import { Shape } from '../common/shape'
import { Vector } from '../vector/vector'
import { SVGUseAttributes } from './types'

@Use.register('Use')
export class Use extends Shape<SVGUseElement> {
  use(element: Vector, file?: string): this
  use(elementId: string, file?: string): this
  use(elementId: string | Vector, file?: string): this
  use(elementId: string | Vector, file?: string) {
    return this.attr('href', `${file || ''}#${elementId}`)
  }
}

export namespace Use {
  export function create<Attributes extends SVGUseAttributes>(
    attrs?: Attributes | null,
  ): Use
  export function create<Attributes extends SVGUseAttributes>(
    element: Vector,
    attrs?: Attributes | null,
  ): Use
  export function create<Attributes extends SVGUseAttributes>(
    elementId: string,
    attrs?: Attributes | null,
  ): Use
  export function create<Attributes extends SVGUseAttributes>(
    element: Vector,
    file: string,
    attrs?: Attributes | null,
  ): Use
  export function create<Attributes extends SVGUseAttributes>(
    elementId: string,
    file: string,
    attrs?: Attributes | null,
  ): Use
  export function create<Attributes extends SVGUseAttributes>(
    elementId?: string | Vector | Attributes | null,
    file?: string | Attributes | null,
    attrs?: Attributes | null,
  ): Use
  export function create<Attributes extends SVGUseAttributes>(
    elementId?: string | Vector | Attributes | null,
    file?: string | Attributes | null,
    attrs?: Attributes | null,
  ) {
    const use = new Use()
    if (elementId) {
      if (typeof elementId === 'string' || elementId instanceof Vector) {
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
