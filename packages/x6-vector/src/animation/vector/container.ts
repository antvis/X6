import { Container } from '../../vector/container/container'
import { SVGAnimator } from '../svg'

export class SVGContainerAnimator<
  TSVGElement extends SVGElement,
  TOwner extends Container<TSVGElement> = Container<TSVGElement>
> extends SVGAnimator<TSVGElement, TOwner> {}
