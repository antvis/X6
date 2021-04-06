import { Polyline } from '../../../element/shape/polyline'
import { SVGPolyAnimator } from './poly'

@SVGPolylineAnimator.register('Polyline')
export class SVGPolylineAnimator extends SVGPolyAnimator<
  SVGPolylineElement,
  Polyline
> {}
