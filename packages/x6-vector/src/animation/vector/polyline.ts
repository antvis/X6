import { Polyline } from '../../vector/polyline/polyline'
import { SVGPolyAnimator } from './poly'

@SVGPolylineAnimator.register('Polyline')
export class SVGPolylineAnimator extends SVGPolyAnimator<
  SVGPolylineElement,
  Polyline
> {}
