import { Rect } from '../../vector/rect/rect'
import { SVGAnimator } from '../svg'

@SVGRectAnimator.register('Rect')
export class SVGRectAnimator extends SVGAnimator<SVGRectElement, Rect> {}
