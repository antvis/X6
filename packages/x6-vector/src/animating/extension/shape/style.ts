import { Style } from '../../../element/shape/style'
import { SVGAnimator } from '../svg'

@SVGStyleAnimator.register('Style')
export class SVGStyleAnimator extends SVGAnimator<SVGStyleElement, Style> {}
