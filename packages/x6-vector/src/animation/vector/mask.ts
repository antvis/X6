import { Mask } from '../../vector/mask/mask'
import { SVGContainerAnimator } from './container'

@SVGMaskAnimator.register('Mask')
export class SVGMaskAnimator extends SVGContainerAnimator<
  SVGMaskElement,
  Mask
> {}
