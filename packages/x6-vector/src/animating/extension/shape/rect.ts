import { Rect } from '../../../element/shape/rect'
import { SVGAnimator } from '../svg'

@SVGRectAnimator.register('Rect')
export class SVGRectAnimator extends SVGAnimator<SVGRectElement, Rect> {}
