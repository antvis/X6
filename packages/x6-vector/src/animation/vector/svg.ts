import { SVG } from '../../vector/svg/svg'
import { SVGViewboxAnimator } from './container-viewbox'

@SVGSVGAnimator.register('Svg')
export class SVGSVGAnimator extends SVGViewboxAnimator<SVGSVGElement, SVG> {}
