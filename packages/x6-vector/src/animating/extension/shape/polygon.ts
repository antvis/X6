import { Polygon } from '../../../element/shape/polygon'
import { SVGPolyAnimator } from './poly'

@SVGPolygonAnimator.register('Polygon')
export class SVGPolygonAnimator extends SVGPolyAnimator<
  SVGPolygonElement,
  Polygon
> {}
