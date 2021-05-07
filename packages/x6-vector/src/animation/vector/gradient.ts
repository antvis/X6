import { Gradient } from '../../vector/gradient/gradient'
import { SVGWrapperAnimator } from './wrapper'

export class SVGGradientAnimator<
  TSVGElement extends SVGGradientElement,
  TOwner extends Gradient<TSVGElement> = Gradient<TSVGElement>
> extends SVGWrapperAnimator<TSVGElement, TOwner> {}
