import { Circle } from '../../../element/shape/circle'
import { SVGAnimator } from '../svg'

@SVGCircleAnimator.register('Circle')
export class SVGCircleAnimator extends SVGAnimator<SVGCircleElement, Circle> {}
