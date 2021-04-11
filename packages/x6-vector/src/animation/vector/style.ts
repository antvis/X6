import { Style } from '../../vector/style/style'
import { SVGAnimator } from '../svg'

@SVGStyleAnimator.register('Style')
export class SVGStyleAnimator extends SVGAnimator<SVGStyleElement, Style> {}
