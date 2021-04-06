import { TSpan } from '../../../element/shape/tspan'
import { SVGAnimator } from '../svg'

@SVGTSpanAnimator.register('Tspan')
export class SVGTSpanAnimator extends SVGAnimator<SVGTSpanElement, TSpan> {}
