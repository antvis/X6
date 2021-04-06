import { Gradient } from '../../../element/container/gradient'
import { SVGContainerAnimator } from './container'

@SVGGradientAnimator.register('Gradient')
export class SVGGradientAnimator extends SVGContainerAnimator<
  SVGLinearGradientElement | SVGRadialGradientElement,
  Gradient
> {}
