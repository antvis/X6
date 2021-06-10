import { Vector } from '../vector/vector'
import { AttributesMap } from '../../dom/attributes'

@Shape.register('Shape')
export class Shape<
  TSVGGraphicsElement extends SVGGraphicsElement,
> extends Vector<TSVGGraphicsElement> {
  constructor()
  constructor(attrs?: AttributesMap<TSVGGraphicsElement> | null)
  constructor(
    node: TSVGGraphicsElement | null,
    attrs?: AttributesMap<TSVGGraphicsElement> | null,
  )
  // eslint-disable-next-line no-useless-constructor
  constructor(
    node?: TSVGGraphicsElement | AttributesMap<TSVGGraphicsElement> | null,
    attrs?: AttributesMap<TSVGGraphicsElement> | null,
  ) {
    super(node, attrs)
  }
}
