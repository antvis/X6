import { RadialGradient } from '../../vector/gradient/radial'
import { SVGGradientAnimator } from './gradient'

@SVGRadialGradientAnimator.register('RadialGradient')
export class SVGRadialGradientAnimator extends SVGGradientAnimator<
  SVGRadialGradientElement,
  RadialGradient
> {}
