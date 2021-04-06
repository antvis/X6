import { G } from '../../../element/container/g'
import { SVGContainerGeometryAnimator } from './container-geometry'

@SVGGAnimator.register('G')
export class SVGGAnimator extends SVGContainerGeometryAnimator<
  SVGGElement,
  G
> {}
