import { LinearGradient } from '../../vector/gradient/linear'
import { SVGGradientAnimator } from './gradient'

@SVGLinearGradientAnimator.register('LinearGradient')
export class SVGLinearGradientAnimator extends SVGGradientAnimator<
  SVGLinearGradientElement,
  LinearGradient
> {}
