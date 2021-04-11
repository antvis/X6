import { Circle } from '../../vector/circle/circle'
import { SVGAnimator } from '../svg'

@SVGCircleAnimator.register('Circle')
export class SVGCircleAnimator extends SVGAnimator<SVGCircleElement, Circle> {}
