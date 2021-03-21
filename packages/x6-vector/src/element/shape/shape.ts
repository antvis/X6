import { Attrs } from '../../types'
import { VectorElement } from '../element'

@Shape.register('Shape')
export class Shape<
  TSVGGraphicsElement extends SVGGraphicsElement
> extends VectorElement<TSVGGraphicsElement> {
  constructor()
  constructor(attrs: Attrs | null)
  constructor(node: TSVGGraphicsElement | null, attrs?: Attrs | null)
  // eslint-disable-next-line no-useless-constructor
  constructor(node?: TSVGGraphicsElement | Attrs | null, attrs?: Attrs | null) {
    super(node, attrs)
  }
}
