import { Polygon } from '../../vector/polygon/polygon'
import { SVGPolyAnimator } from './poly'

@SVGPolygonAnimator.register('Polygon')
export class SVGPolygonAnimator extends SVGPolyAnimator<
  SVGPolygonElement,
  Polygon
> {}
