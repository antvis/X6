import { Ellipse } from '../../vector/ellipse/ellipse'
import { SVGAnimator } from '../svg'

@SVGEllipseAnimator.register('Ellipse')
export class SVGEllipseAnimator extends SVGAnimator<
  SVGEllipseElement,
  Ellipse
> {}
