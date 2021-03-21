import { Attrs } from '../../types'
import { GeometryContainer } from './container-geometry'

@G.register('G')
export class G extends GeometryContainer<SVGGElement> {}

export namespace G {
  export function create(attrs?: Attrs | null) {
    const g = new G()
    if (attrs) {
      g.attr(attrs)
    }
    return g
  }
}
