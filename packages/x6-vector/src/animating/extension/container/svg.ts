import { Svg } from '../../../element/container/svg'
import { SVGViewboxAnimator } from './container-viewbox'

@SVGSVGAnimator.register('Svg')
export class SVGSVGAnimator extends SVGViewboxAnimator<SVGSVGElement, Svg> {}
