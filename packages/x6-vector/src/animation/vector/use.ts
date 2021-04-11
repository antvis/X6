import { Use } from '../../vector/use/use'
import { SVGAnimator } from '../svg'

@SVGUseAnimator.register('Use')
export class SVGUseAnimator extends SVGAnimator<SVGUseElement, Use> {}
