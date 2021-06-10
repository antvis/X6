import { Wrapper } from '../../vector/container/wrapper'
import { SVGAnimator } from '../svg'

export class SVGWrapperAnimator<
  TSVGElement extends SVGElement,
  TOwner extends Wrapper<TSVGElement> = Wrapper<TSVGElement>,
> extends SVGAnimator<TSVGElement, TOwner> {}
