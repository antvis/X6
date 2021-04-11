import { G } from '../../vector/g/g'
import { SVGContainerGeometryAnimator } from './container-geometry'

@SVGGAnimator.register('G')
export class SVGGAnimator extends SVGContainerGeometryAnimator<
  SVGGElement,
  G
> {}
