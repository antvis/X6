import { A } from '../../vector/a/a'
import { SVGContainerGeometryAnimator } from './container-geometry'

@SVGAAnimator.register('A')
export class SVGAAnimator extends SVGContainerGeometryAnimator<
  SVGAElement,
  A
> {}
