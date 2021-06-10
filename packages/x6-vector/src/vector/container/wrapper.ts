import { Vector } from '../vector/vector'
import { AttributesMap } from '../../dom/attributes'

export class Wrapper<
  TSVGElement extends SVGElement = SVGElement,
> extends Vector<TSVGElement> {
  constructor()
  constructor(attrs: AttributesMap<TSVGElement> | null)
  constructor(
    node: TSVGElement | null,
    attrs?: AttributesMap<TSVGElement> | null,
  )
  constructor(
    node?: TSVGElement | AttributesMap<TSVGElement> | null,
    attrs?: AttributesMap<TSVGElement> | null,
  )
  // eslint-disable-next-line no-useless-constructor
  constructor(
    node?: TSVGElement | AttributesMap<TSVGElement> | null,
    attrs?: AttributesMap<TSVGElement> | null,
  ) {
    super(node, attrs)
  }
}
