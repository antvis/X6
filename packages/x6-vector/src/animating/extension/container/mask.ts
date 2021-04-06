import { Mask } from '../../../element/container/mask'
import { SVGContainerAnimator } from './container'

@SVGMaskAnimator.register('Mask')
export class SVGMaskAnimator extends SVGContainerAnimator<
  SVGMaskElement,
  Mask
> {}
