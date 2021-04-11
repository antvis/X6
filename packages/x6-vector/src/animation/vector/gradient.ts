import { Gradient } from '../../vector/gradient/gradient'
import { SVGContainerAnimator } from './container'

export class SVGGradientAnimator<
  TSVGElement extends SVGGradientElement,
  TOwner extends Gradient<TSVGElement> = Gradient<TSVGElement>
> extends SVGContainerAnimator<TSVGElement, TOwner> {}
