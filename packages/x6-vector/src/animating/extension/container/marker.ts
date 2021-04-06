import { Marker } from '../../../element/container/marker'
import { SVGViewboxAnimator } from './container-viewbox'

@SVGMarkerAnimator.register('Marker')
export class SVGMarkerAnimator extends SVGViewboxAnimator<
  SVGMarkerElement,
  Marker
> {}
