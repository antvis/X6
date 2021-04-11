import { TSpan } from '../../vector/tspan/tspan'
import { SVGAnimator } from '../svg'

@SVGTSpanAnimator.register('Tspan')
export class SVGTSpanAnimator extends SVGAnimator<SVGTSpanElement, TSpan> {}
