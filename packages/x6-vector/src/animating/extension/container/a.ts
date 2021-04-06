import { A } from '../../../element/container/a'
import { SVGContainerGeometryAnimator } from './container-geometry'

@SVGAAnimator.register('A')
export class SVGAAnimator extends SVGContainerGeometryAnimator<
  SVGAElement,
  A
> {}
