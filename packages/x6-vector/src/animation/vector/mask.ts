import { Mask } from '../../vector/mask/mask'
import { SVGWrapperAnimator } from './wrapper'

@SVGMaskAnimator.register('Mask')
export class SVGMaskAnimator extends SVGWrapperAnimator<SVGMaskElement, Mask> {}
