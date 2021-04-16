import { ContainerGeometry } from '../container/geometry'
import { SVGGAttributes } from './types'

@G.register('G')
export class G extends ContainerGeometry<SVGGElement> {}

export namespace G {
  export function create<Attributes extends SVGGAttributes>(
    attrs?: Attributes | null,
  ) {
    const g = new G()
    if (attrs) {
      g.attr(attrs)
    }
    return g
  }
}
