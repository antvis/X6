import { Ellipse } from '../../../element/shape/ellipse'
import { SVGAnimator } from '../svg'

@SVGEllipseAnimator.register('Ellipse')
export class SVGEllipseAnimator extends SVGAnimator<
  SVGEllipseElement,
  Ellipse
> {}
